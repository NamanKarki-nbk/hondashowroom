import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activityLogger";
import { verifySessionToken } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Fetch Leads that came from the Exchange Valuation calculator
    const leads = await prisma.lead.findMany({
      where: { interestedIn: 'Exchange Valuation' },
      orderBy: { createdAt: 'desc' }
    });

    // Format them to match what ValuationsClient.tsx expects
    const valuations = leads.map(lead => {
      // Try to parse the remarks for details. 
      // Format: "I want to exchange my Honda Shine BS6 (2020, 10,000 km, 1st Owner).\n\nEstimated Valuation: NPR 50,000 - NPR 55,000"
      let oldBrand = "Honda";
      let oldModel = "Vehicle";
      let manufactureYear = "Unknown";
      let condition = "Unknown";
      let estimatedValue = 0;

      if (lead.remarks) {
        const parts = lead.remarks.split('\n\n');
        if (parts.length > 0) {
          const match = parts[0].match(/exchange my (.*?) \((.*?)\)/);
          if (match) {
            const vehicleStr = match[1];
            oldBrand = vehicleStr.split(' ')[0] || "Honda";
            oldModel = vehicleStr.split(' ').slice(1).join(' ') || "Vehicle";
            
            const details = match[2].split(', ');
            manufactureYear = details[0] || "Unknown";
            condition = details[1] + (details[2] ? `, ${details[2]}` : '');
          }
        }
        if (parts.length > 1 && parts[1].includes('Estimated Valuation: NPR')) {
          const valMatch = parts[1].match(/NPR ([\d,]+) - NPR ([\d,]+)/);
          if (valMatch) {
            estimatedValue = parseInt(valMatch[2].replace(/,/g, ''));
          }
        }
      }

      // Map LeadStatus to ValuationStatus expected by frontend
      let valStatus = 'EVALUATED';
      if (lead.status === 'CONVERTED') valStatus = 'ACCEPTED';
      if (lead.status === 'LOST') valStatus = 'REJECTED';

      return {
        id: lead.id,
        customer: { fullName: lead.name, phone: lead.phone },
        oldBrand,
        oldModel,
        manufactureYear,
        condition,
        estimatedValue,
        finalOffered: null,
        remarks: lead.remarks,
        status: valStatus
      };
    });

    // Client-side filtering by status if provided
    let filtered = valuations;
    if (status && status !== 'ALL') {
      filtered = valuations.filter(v => v.status === status);
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Failed to fetch valuations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, finalOffered, remarks } = body;
    
    const updateData: any = {};
    
    // Map status back to LeadStatus
    if (status) {
      if (status === 'ACCEPTED') updateData.status = 'CONVERTED';
      else if (status === 'REJECTED') updateData.status = 'LOST';
      else updateData.status = 'CONTACTED';
    }

    // Since Lead doesn't have finalOffered, we append it to remarks if updated
    if (finalOffered) {
      updateData.remarks = remarks ? `${remarks}\n\nFinal Offered: ${finalOffered}` : `Final Offered: ${finalOffered}`;
    } else if (remarks !== undefined) {
      updateData.remarks = remarks;
    }
    
    const lead = await prisma.lead.update({
      where: { id },
      data: updateData
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "UPDATE",
      entity: "Lead",
      entityId: lead.id,
      details: {
        customerName: lead.name,
        customerPhone: lead.phone,
        newStatus: lead.status
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update valuation lead:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
