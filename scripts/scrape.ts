import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const API_URL = 'https://honda.com.np/wp-admin/admin-ajax.php?action=getFilteredProducts';

const PRODUCT_TYPES: Record<string, number> = {
  Bikes: 4,
  Scooters: 8,
  Trimmer: 3,
  Generators: 5,
  LawnMowers: 6,
  WaterPumps: 7,
  BrushCutters: 15,
  Tillers: 16,
  Sprayer: 17
};

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!url) return resolve(false);
    // Ensure URL is absolute
    if (url.startsWith('/')) {
      url = 'https://honda.com.np' + url;
    }
    
    // Create directory if not exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(filepath);
    const client = url.startsWith('https') ? https : http;

    client.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else {
        file.close();
        fs.unlink(filepath, () => {});
        reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err.message);
    });
  });
}

async function fetchProducts() {
  console.log("Fetching products from Honda Nepal...");
  
  // Construct the form data payload
  const formData = new URLSearchParams();
  Object.values(PRODUCT_TYPES).forEach(id => {
    formData.append('product_type[]', id.toString());
  });
  formData.append('action', 'getFilteredProducts');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      },
      body: formData.toString()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: any[] = await response.json();
    console.log(`Found ${data.length} products.`);

    const formattedProducts = [];

    for (const item of data) {
      let meta: any = {};
      let variations: any = {};
      
      try {
        if (item.meta) meta = JSON.parse(item.meta);
        if (item.model_variations) variations = JSON.parse(item.model_variations);
      } catch (e) {
        console.error("Error parsing JSON for item:", item.name);
      }

      let category = "Unknown";
      const catId = parseInt(item.category_id);
      if (catId === 4) category = "MOTORCYCLES";
      else if (catId === 8) category = "SCOOTERS";
      else category = "POWER_PRODUCTS";

      // Download Thumbnail
      let thumbnailUrl = "";
      if (item.gallery) {
        try {
          const gallery = JSON.parse(item.gallery);
          thumbnailUrl = gallery.thumbnail_image || "";
        } catch(e) {}
      }

      // Download Main image if thumbnail not found, fall back to variations
      if (!thumbnailUrl && variations.variations && variations.variations.length > 0) {
        thumbnailUrl = variations.variations[0].image;
      }
      
      let localImage = "";
      if (thumbnailUrl) {
        const ext = path.extname(thumbnailUrl) || '.png';
        const filename = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + ext;
        localImage = `/inventory/${filename}`;
        
        console.log(`Downloading image for ${item.name}...`);
        try {
          await downloadImage(thumbnailUrl, path.join(__dirname, '..', 'public', 'inventory', filename));
        } catch (err) {
          console.error(`Failed to download image for ${item.name}: ${err}`);
          localImage = "";
        }
      }

      formattedProducts.push({
        id: item.id,
        name: item.name,
        category: category,
        price: parseInt(item.price) || 0,
        imageUrl: localImage || thumbnailUrl, // fallback to remote URL if local fails
        description: "", 
        specs: {}
      });
    }

    fs.writeFileSync(path.join(__dirname, '..', 'prisma', 'scraped_data.json'), JSON.stringify(formattedProducts, null, 2));
    console.log("Scraping completed and saved to prisma/scraped_data.json");

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchProducts();
