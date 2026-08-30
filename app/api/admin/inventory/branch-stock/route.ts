import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryFilter = searchParams.get('category')?.toLowerCase() || '';

    // Fetch all active branches
    const activeBranches = await prisma.branch.findMany({
      where: { isActive: true },
      select: { id: true, name: true }
    });
    
    // Sort branches alphabetically for consistent column ordering
    activeBranches.sort((a, b) => a.name.localeCompare(b.name));
    const branchNames = activeBranches.map(b => b.name);

    // Fetch all in-stock vehicles with their branch details
    const inventory = await prisma.vehicleInventory.findMany({
      where: {
        status: 'IN_STOCK',
        ...(categoryFilter ? { variant: { vehicleMaster: { category: categoryFilter.toUpperCase() as any } } } : {})
      },
      include: {
        branch: {
          select: { name: true }
        },
        variant: {
          include: {
            vehicleMaster: true
          }
        }
      }
    });

    // Grouping structure: modelName -> color -> branchName -> count
    const grouped: Record<string, Record<string, Record<string, number>>> = {};

    inventory.forEach(vehicle => {
      const modelName = vehicle.variant?.vehicleMaster?.name || 'Unknown';
      const { color, branch } = vehicle;
      const branchName = branch?.name || 'Unassigned';

      if (!grouped[modelName]) {
        grouped[modelName] = {};
      }
      if (!grouped[modelName][color]) {
        grouped[modelName][color] = {};
        // Initialize branch counts to 0 for this color
        branchNames.forEach(bName => {
          grouped[modelName][color][bName] = 0;
        });
        grouped[modelName][color]['Unassigned'] = 0;
      }

      grouped[modelName][color][branchName] = (grouped[modelName][color][branchName] || 0) + 1;
    });

    // Format for the frontend
    const models = Object.keys(grouped).map(modelName => {
      const colorsData = grouped[modelName];
      const modelTotals: Record<string, number> = { total: 0 };
      branchNames.forEach(bName => { modelTotals[bName] = 0; });
      modelTotals['Unassigned'] = 0;

      const colors = Object.keys(colorsData).map(colorName => {
        const branchCounts = colorsData[colorName];
        let colorTotal = 0;
        
        Object.keys(branchCounts).forEach(bName => {
          colorTotal += branchCounts[bName];
          modelTotals[bName] += branchCounts[bName];
        });
        
        modelTotals.total += colorTotal;

        return {
          colorName,
          branches: branchCounts,
          total: colorTotal
        };
      });

      // Sort colors alphabetically
      colors.sort((a, b) => a.colorName.localeCompare(b.colorName));

      return {
        modelName,
        colors,
        totals: modelTotals
      };
    });

    // Sort models alphabetically
    models.sort((a, b) => a.modelName.localeCompare(b.modelName));

    // Ensure 'Unassigned' is only in the list if there are unassigned vehicles overall
    const hasUnassigned = models.some(m => m.totals['Unassigned'] > 0);
    const finalBranchNames = [...branchNames];
    if (hasUnassigned) {
      finalBranchNames.push('Unassigned');
    }

    return NextResponse.json({
      branches: finalBranchNames,
      models
    });
  } catch (error) {
    console.error('Error fetching branch stock matrix:', error);
    return NextResponse.json({ error: 'Failed to fetch branch stock' }, { status: 500 });
  }
}
