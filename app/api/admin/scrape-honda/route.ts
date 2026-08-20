import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Honda Nepal AJAX API endpoint
const HONDA_API_URL = 'https://honda.com.np/wp-admin/admin-ajax.php?action=getFilteredProducts';

// Product type IDs from Honda Nepal's WordPress
const PRODUCT_TYPE_IDS = {
  MOTORCYCLES: [4],
  SCOOTERS: [8],
  POWER_PRODUCTS: [3, 5, 6, 7, 15, 16, 17],
};

// Map Honda's category IDs to our database categories
const CATEGORY_MAP: Record<string, string> = {
  '4': 'MOTORCYCLES',
  '8': 'SCOOTERS',
  '3': 'POWER_PRODUCTS',
  '5': 'POWER_PRODUCTS',
  '6': 'POWER_PRODUCTS',
  '7': 'POWER_PRODUCTS',
  '15': 'POWER_PRODUCTS',
  '16': 'POWER_PRODUCTS',
  '17': 'POWER_PRODUCTS',
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function safeParseJson(str: string | null | undefined): any {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function extractImageUrl(product: any): string {
  const gallery = safeParseJson(product.gallery);
  
  // 1. Try thumbnail_image from gallery (always populated for bikes/scooters)
  if (gallery?.thumbnail_image) {
    return ensureAbsoluteUrl(gallery.thumbnail_image);
  }
  
  // 2. Try first non-empty image from gallery images array (power products)
  if (gallery?.images && Array.isArray(gallery.images)) {
    const firstImg = gallery.images.find((img: string) => img && img.trim());
    if (firstImg) return ensureAbsoluteUrl(firstImg);
  }
  
  // 3. Try first variant image from model_variations
  const variations = safeParseJson(product.model_variations);
  if (variations?.variations && Array.isArray(variations.variations)) {
    const firstWithImg = variations.variations.find((v: any) => v.image && v.image.trim());
    if (firstWithImg) return ensureAbsoluteUrl(firstWithImg.image);
  }
  
  // 4. Try banner_image as last resort
  if (gallery?.banner_image) {
    return ensureAbsoluteUrl(gallery.banner_image);
  }
  
  return '';
}

function ensureAbsoluteUrl(url: string): string {
  if (!url) return '';
  url = url.trim();
  if (url.startsWith('http')) return url;
  return `https://honda.com.np${url.startsWith('/') ? '' : '/'}${url}`;
}

function extractPrice(product: any): number {
  // Try direct price field first
  if (product.price && !isNaN(Number(product.price))) {
    return Number(product.price);
  }

  // Try model_variations for the lowest price
  const variations = safeParseJson(product.model_variations);
  if (variations?.variations && Array.isArray(variations.variations)) {
    const prices = variations.variations
      .map((v: any) => Number(v.price))
      .filter((p: number) => !isNaN(p) && p > 0);
    if (prices.length > 0) return Math.min(...prices);
  }

  return 0;
}

function extractSpecs(product: any): Record<string, any> {
  const result: Record<string, any> = {};

  // Parse meta (engine displacement, power, torque, etc.)
  const meta = safeParseJson(product.meta);
  if (meta) {
    result.engine = meta;
  }

  // Parse full specs object (top-level 'specifications' field from API)
  const specs = safeParseJson(product.specifications);
  if (specs) {
    result.specifications = specs;
  }

  // Parse model variations (variant names, prices, images)
  const variations = safeParseJson(product.model_variations);
  if (variations?.variations && Array.isArray(variations.variations)) {
    result.variants = variations.variations
      .filter((v: any) => v.name || v.price || v.image)
      .map((v: any) => ({
        name: v.name || '',
        colorCode: v.color_code || '',
        image: v.image ? ensureAbsoluteUrl(v.image) : '',
        price: Number(v.price) || 0,
      }));
  }

  // Parse colors
  const colors = safeParseJson(product.colors);
  if (colors?.colors && Array.isArray(colors.colors)) {
    result.colors = colors.colors.map((c: any) => ({
      name: c.name || '',
      colorCode: c.color_code || '',
      image: c.image ? ensureAbsoluteUrl(c.image) : '',
    }));
  }

  // Parse gallery images
  const gallery = safeParseJson(product.gallery);
  if (gallery) {
    if (gallery.images) {
      result.galleryImages = gallery.images
        .filter((img: string) => img && img.trim())
        .map((img: string) => ensureAbsoluteUrl(img));
    }
    if (gallery.banner_image) {
      result.bannerImage = ensureAbsoluteUrl(gallery.banner_image);
    }
  }

  // Parse features & USP
  const features = safeParseJson(product.features);
  if (features) result.features = features;

  const usp = safeParseJson(product.usp);
  if (usp) result.usp = usp;

  return result;
}

export async function POST() {
  try {
    // Fetch all product types from Honda Nepal
    const allTypeIds = [
      ...PRODUCT_TYPE_IDS.MOTORCYCLES,
      ...PRODUCT_TYPE_IDS.SCOOTERS,
      ...PRODUCT_TYPE_IDS.POWER_PRODUCTS,
    ];

    // Build form data for the request
    const formBody = allTypeIds
      .map(id => `product_type%5B%5D=${id}`)
      .join('&');

    const response = await fetch(HONDA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: formBody,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Honda API returned ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();

    // The API may return products as an array or object
    let products: any[] = [];
    if (Array.isArray(data)) {
      products = data;
    } else if (data.products && Array.isArray(data.products)) {
      products = data.products;
    } else if (typeof data === 'object') {
      // Sometimes WordPress returns keyed objects
      products = Object.values(data).filter(
        (item: any) => item && typeof item === 'object' && item.name
      );
    }

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'No products found from Honda Nepal API', rawKeys: Object.keys(data) },
        { status: 404 }
      );
    }

    let upsertedCount = 0;
    const errors: string[] = [];

    for (const product of products) {
      try {
        const categoryId = product.category_id || product.product_type || '';
        const category = CATEGORY_MAP[String(categoryId)] || 'MOTORCYCLES';
        const imageUrl = extractImageUrl(product);
        const price = extractPrice(product);
        const specs = extractSpecs(product);
        const description = product.description ? stripHtml(product.description) : null;
        const productId = `honda-${product.id}`;

        await prisma.productCatalog.upsert({
          where: { id: productId },
          update: {
            name: product.name || 'Unknown Product',
            category,
            price,
            imageUrl: imageUrl || '',
            description,
            specs: specs as any,
          },
          create: {
            id: productId,
            name: product.name || 'Unknown Product',
            category,
            price,
            imageUrl: imageUrl || '',
            description,
            specs: specs as any,
          },
        });

        upsertedCount++;
      } catch (err: any) {
        errors.push(`Failed to save ${product.name}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${upsertedCount} products from Honda Nepal`,
      totalFound: products.length,
      upsertedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Honda scraper error:', error);
    return NextResponse.json(
      { error: `Scraper failed: ${error.message}` },
      { status: 500 }
    );
  }
}
