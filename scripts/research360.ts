import * as puppeteer from 'puppeteer';

async function run() {
  console.log("Launching Puppeteer...");
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // Intercept network requests to find 360 images
  const imageRequests = new Set<string>();
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.resourceType() === 'image') {
      const url = request.url();
      if (url.includes('360') || url.includes('frame') || /\\d+\\.jpg$/.test(url) || /\\d+\\.png$/.test(url)) {
        imageRequests.add(url);
      }
    }
    request.continue();
  });

  console.log("Navigating to Dio 125 page...");
  await page.goto('https://www.honda2wheelersindia.com/scooter/dio-125', { waitUntil: 'networkidle0' });
  
  // Wait a bit and try to interact with the 360 viewer if it exists
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("Found potential 360 image URLs:", [...imageRequests]);
  
  await browser.close();
}

run();
