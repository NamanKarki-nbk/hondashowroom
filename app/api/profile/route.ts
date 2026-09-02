import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/session";
import { DocumentType } from "@/app/generated/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifySessionToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        customerProfile: {
          include: { documents: true }
        }
      }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const customer = user.customerProfile;
    const documents = customer?.documents || [];

    const getDoc = (type: DocumentType) => documents.find(d => d.docType === type);
    
    const citz = getDoc(DocumentType.CITIZENSHIP);
    const lic = getDoc(DocumentType.LICENSE);
    const nid = getDoc(DocumentType.NATIONAL_ID);

    const flatUser = {
      ...user,
      ...(customer || {}),
      isVerified: user.isVerified,
      kycVerified: customer?.isVerified || documents.some(d => d.isVerified) || false,
      
      // Map documents back to flat structure for the frontend
      citizenshipVerified: citz?.isVerified || false,
      citizenshipNumber: citz?.docNumber || "",
      citizenshipFront: citz?.frontUrl || "",
      citizenshipBack: citz?.backUrl || "",
      
      licenseVerified: lic?.isVerified || false,
      licenseNumber: lic?.docNumber || "",
      licenseFront: lic?.frontUrl || "",
      licenseBack: lic?.backUrl || "",

      nationalIdVerified: nid?.isVerified || false,
      nationalIdNumber: nid?.docNumber || "",
      nationalIdFront: nid?.frontUrl || "",
      nationalIdBack: nid?.backUrl || "",
    };
    
    delete (flatUser as any).passwordHash;
    delete (flatUser as any).customerProfile;

    return NextResponse.json({ user: flatUser });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifySessionToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });

    const updates = await req.json();
    
    // Whitelist allowed update fields
    const allowedUserUpdates = [
      "fullName", "email", "phone", "avatarUrl", "address", 
      "gender", "dobAd", "dobBs"
    ];

    const allowedCustomerUpdates = [
      "fullName", "email", "phone", "address"
    ];
    
    const userData: Record<string, any> = {};
    const customerData: Record<string, any> = {};
    
    for (const key of Object.keys(updates)) {
      if (updates[key] !== undefined) {
        if (allowedUserUpdates.includes(key)) {
          userData[key] = updates[key] === "" ? null : updates[key]; // Handle clearing dates
        }
        if (allowedCustomerUpdates.includes(key)) {
          customerData[key] = updates[key];
        }
      }
    }

    // Process DOB for User (make sure it's Date type)
    if (userData.dobAd) {
      userData.dobAd = new Date(userData.dobAd);
    }

    let updatedUser: any = null;
    if (Object.keys(userData).length > 0) {
      updatedUser = await prisma.user.update({
        where: { id: payload.userId },
        data: userData,
      });
    } else {
      updatedUser = await prisma.user.findUnique({ where: { id: payload.userId } });
    }

    if (Object.keys(customerData).length > 0 || updates.citizenshipNumber !== undefined || updates.licenseNumber !== undefined || updates.nationalIdNumber !== undefined) {
      const upsertCustomerData = {
        ...customerData,
        phone: customerData.phone || updatedUser.phone,
        fullName: customerData.fullName || updatedUser.fullName || "Unknown",
      };

      const customer = await prisma.customer.upsert({
        where: { userId: payload.userId },
        update: customerData,
        create: {
          ...upsertCustomerData,
          userId: payload.userId,
        }
      });
      
      // Update documents
      const upsertDoc = async (type: DocumentType, prefix: string) => {
        if (updates[`${prefix}Number`] !== undefined || updates[`${prefix}Front`] !== undefined) {
          await prisma.customerDocument.upsert({
            where: { customerId_docType: { customerId: customer.id, docType: type } },
            update: {
              docNumber: updates[`${prefix}Number`],
              frontUrl: updates[`${prefix}Front`],
              backUrl: updates[`${prefix}Back`],
              isVerified: updates[`${prefix}Verified`] || false,
            },
            create: {
              customerId: customer.id,
              docType: type,
              docNumber: updates[`${prefix}Number`] || null,
              frontUrl: updates[`${prefix}Front`] || null,
              backUrl: updates[`${prefix}Back`] || null,
              isVerified: updates[`${prefix}Verified`] || false,
            }
          });
        }
      };

      await upsertDoc(DocumentType.CITIZENSHIP, "citizenship");
      await upsertDoc(DocumentType.LICENSE, "license");
      await upsertDoc(DocumentType.NATIONAL_ID, "nationalId");

      // Auto-verify customer if ANY single document is verified
      const allDocs = await prisma.customerDocument.findMany({
        where: { customerId: customer.id }
      });
      const hasAnyVerifiedDoc = allDocs.some(d => d.isVerified);
      if (hasAnyVerifiedDoc && !customer.isVerified) {
        await prisma.customer.update({
          where: { id: customer.id },
          data: { isVerified: true }
        });
      }
    }

    // Refetch the full user structure similar to GET
    const finalUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { 
        customerProfile: {
          include: { documents: true }
        } 
      }
    });

    const finalCustomer = finalUser?.customerProfile;
    const finalDocuments = finalCustomer?.documents || [];
    const getFinalDoc = (type: DocumentType) => finalDocuments.find(d => d.docType === type);
    
    const c = getFinalDoc(DocumentType.CITIZENSHIP);
    const l = getFinalDoc(DocumentType.LICENSE);
    const n = getFinalDoc(DocumentType.NATIONAL_ID);

    const flatUser = {
      ...finalUser,
      ...(finalCustomer || {}),
      isVerified: finalUser?.isVerified || false,
      kycVerified: finalCustomer?.isVerified || finalDocuments.some(d => d.isVerified) || false,
      
      citizenshipVerified: c?.isVerified || false,
      citizenshipNumber: c?.docNumber || "",
      citizenshipFront: c?.frontUrl || "",
      citizenshipBack: c?.backUrl || "",
      
      licenseVerified: l?.isVerified || false,
      licenseNumber: l?.docNumber || "",
      licenseFront: l?.frontUrl || "",
      licenseBack: l?.backUrl || "",

      nationalIdVerified: n?.isVerified || false,
      nationalIdNumber: n?.docNumber || "",
      nationalIdFront: n?.frontUrl || "",
      nationalIdBack: n?.backUrl || "",
    };
    delete (flatUser as any).passwordHash;
    delete (flatUser as any).customerProfile;

    return NextResponse.json({ success: true, user: flatUser });
  } catch (error) {
    console.error("Profile update error: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
