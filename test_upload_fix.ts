import { uploadToCloudinary } from './lib/upload';
import fs from 'fs';
import path from 'path';

async function run() {
  const buffer = fs.readFileSync('package.json');
  // Mock File object
  const file = new File([buffer], 'test.pdf', { type: 'application/pdf' });
  
  try {
    const url = await uploadToCloudinary(file, 'honda-showroom/finance-pdfs');
    console.log('UPLOADED URL:', url);
  } catch (err) {
    console.error('ERROR:', err);
  }
}
run();
