import { streamText, tool, convertToModelMessages } from 'ai';
import { groq } from '@ai-sdk/groq';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const flexSchema = z.object({
  query: z.string().optional().describe('Search query for vehicle or power product model e.g. "EZ3000CX", "Dio", "Shine", "Generator", "Tiller"'),
  modelQuery: z.string().optional().describe('Model query string'),
  model: z.string().optional().describe('Model name'),
  type: z.string().optional().describe('Product type'),
  category: z.string().optional().describe('Product category'),
  model_name: z.string().optional().describe('Model name string'),
  product_name: z.string().optional().describe('Product name string'),
  vehicle_name: z.string().optional().describe('Vehicle name string'),
  locationQuery: z.string().optional().describe('Location query string'),
  topic: z.string().optional().describe('Topic string'),
});

function extractQueryStr(input: any): string {
  if (!input || typeof input !== 'object') return '';
  const val = input.query || input.modelQuery || input.model || input.product_name || input.model_name || input.vehicle_name || input.name || input.locationQuery || input.topic || input.type || '';
  return typeof val === 'string' ? val.trim() : '';
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const safeMessages = (messages || []).map((m: any) => ({
      ...m,
      parts: m.parts || (m.content ? [{ type: 'text', text: m.content }] : []),
    }));

    const modelMessages = await convertToModelMessages(safeMessages);
    const result = await streamText({
      model: groq('openai/gpt-oss-120b'),
      system: `You are the official Honda Dealership Assistant for Nepal.
      You assist customers with vehicle queries, pricing, finance, accessories, manuals, store locations, and power products (generators, tillers, lawn mowers, water pumps, sprayers, trimmers).
      Always be polite and helpful. You can understand Romanized Nepali (e.g. "kasto chha", "kati parcha") but mostly reply in English or natural Romanized Nepali if the user speaks it.
      If asked about vehicle or power product info, use the get_vehicle_info tool.
      If asked to calculate finance or EMI, use the calculate_finance tool.
      If asked about accessories, use the get_accessories tool.
      If asked about store locations, address, or phone number, use the get_store_locations tool.
      If asked about user manuals or maintenance schedules, use the get_manuals_info tool.
      CRITICAL: Once you receive the tool's result, you MUST IMMEDIATELY provide a clear, conversational answer to the user summarizing the data. Do NOT call the tool again for the same query.`,
      messages: modelMessages,
      stopWhen: ({ steps }) => steps.length >= 3,
      tools: {
        get_vehicle_info: tool({
          description: 'Get information about Honda vehicles, motorcycles, scooters, and power products (generators, tillers, lawn mowers, water pumps, sprayers, trimmers) such as price, engine cc, category, and model name.',
          parameters: flexSchema,
          execute: async (input: z.infer<typeof flexSchema>) => {
            const queryStr = extractQueryStr(input);
            
            const vehicles = await prisma.vehicle.findMany({
              where: queryStr ? {
                modelName: {
                  contains: queryStr,
                  mode: 'insensitive',
                },
              } : undefined,
              select: {
                modelName: true,
                cc: true,
                price: true,
                baseInsurance: true,
              },
              take: 5,
            });

            const powerProductsAndCatalog = await prisma.productCatalog.findMany({
              where: queryStr ? {
                OR: [
                  { name: { contains: queryStr, mode: 'insensitive' } },
                  { category: { contains: queryStr, mode: 'insensitive' } },
                  { description: { contains: queryStr, mode: 'insensitive' } },
                ]
              } : undefined,
              select: {
                name: true,
                category: true,
                price: true,
                description: true,
              },
              take: 8,
            });

            return { vehicles, powerProductsAndCatalog };
          },
        } as any),
        calculate_finance: tool({
          description: 'Calculate finance EMI and downpayment options based on user requirements for a specific vehicle.',
          parameters: flexSchema,
          execute: async (input: z.infer<typeof flexSchema>) => {
            const queryStr = extractQueryStr(input);
            let vehicle = null;
            if (queryStr) {
              vehicle = await prisma.vehicle.findFirst({
                where: {
                  modelName: {
                    contains: queryStr,
                    mode: 'insensitive',
                  },
                },
              });
            }
            if (!vehicle) {
              vehicle = await prisma.vehicle.findFirst();
            }
            
            if (!vehicle) return { error: "No vehicles found in database" };

            // Find the best matching service charge pattern
            const patterns = ["CRF 300", "CB 350", "XR", "NX 200", "DIO 125 SMART", "DEFAULT"];
            let matchedPattern = "DEFAULT";
            for (const pattern of patterns) {
              if (vehicle.modelName.toUpperCase().includes(pattern) && pattern !== "DEFAULT") {
                matchedPattern = pattern;
                break;
              }
            }

            const serviceCharges = await prisma.serviceCharge.findMany({
              where: {
                modelPattern: matchedPattern,
              },
              orderBy: {
                downpaymentPct: 'desc'
              }
            });

            return { 
              vehicle: { modelName: vehicle.modelName, price: vehicle.price }, 
              serviceCharges: serviceCharges.map((opt: any) => ({
                downpaymentPercent: opt.downpaymentPct,
                tenureMonths: opt.tenureMonths,
                serviceChargeAmount: opt.amount,
                downpaymentAmount: Math.round(vehicle.price * (opt.downpaymentPct / 100)),
                principalAmount: Math.round(vehicle.price - (vehicle.price * (opt.downpaymentPct / 100))),
                estimatedMonthlyEMI: Math.round(((vehicle.price - (vehicle.price * (opt.downpaymentPct / 100))) * 1.14) / opt.tenureMonths)
              }))
            };
          },
        } as any),
        get_accessories: tool({
          description: 'Get a list of available accessories, their prices, and stock status for a specific vehicle model, or all accessories if no model is provided.',
          parameters: flexSchema,
          execute: async (input: z.infer<typeof flexSchema>) => {
            const queryStr = extractQueryStr(input);
            let accessories = await prisma.accessory.findMany({
              orderBy: { createdAt: 'desc' },
              take: 10,
            });

            if (queryStr) {
              accessories = accessories.filter((acc: any) => 
                acc.compatibility.some((model: string) => model.toLowerCase().includes(queryStr.toLowerCase())) || 
                acc.vehicleType.toLowerCase() === 'universal'
              );
            }

            return { 
              accessories: accessories.map((acc: any) => ({
                name: acc.name,
                price: acc.price,
                stockStatus: acc.stockStatus,
              }))
            };
          },
        } as any),
        get_store_locations: tool({
          description: 'Get information about store locations, addresses, and contact numbers.',
          parameters: flexSchema,
          execute: async (input: z.infer<typeof flexSchema>) => {
            const branches = await prisma.branch.findMany({
              select: {
                name: true,
                address: true,
                phone: true,
                isEmergency: true,
              },
            });
            if (branches.length > 0) {
              return {
                stores: branches.map((o: any) => ({
                  name: o.name,
                  address: o.address,
                  contact: o.phone,
                  isEmergency: o.isEmergency,
                  hours: "Sunday to Friday, 9:00 AM - 6:00 PM"
                }))
              };
            }
            return {
              stores: [
                {
                  name: "Honda Showroom Kathmandu (Main)",
                  address: "Kantipath, Kathmandu, Nepal",
                  contact: "+977-1-4222222",
                  hours: "Sunday to Friday, 9:00 AM - 6:00 PM"
                }
              ]
            };
          },
        } as any),
        get_manuals_info: tool({
          description: 'Get information about where users can find owner manuals or typical maintenance schedules.',
          parameters: flexSchema,
          execute: async (input: z.infer<typeof flexSchema>) => {
            return {
              info: "All official Honda owner manuals and maintenance schedules are available digitally on our website. Customers can navigate to the 'Owners Manual' section in the top menu to download PDF copies. Regular maintenance is typically recommended every 2500km to 3000km depending on the model."
            };
          },
        } as any),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (e: any) {
    console.error("STREAM ERROR:", e);
    return new Response(e.message, { status: 500 });
  }
}
