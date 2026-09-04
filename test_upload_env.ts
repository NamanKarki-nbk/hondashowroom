import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  const isPdf = true;
  const folder = 'honda-showroom/finance-pdfs';
  
  const uploadOptions: any = {
    folder,
    resource_type: isPdf ? 'raw' : 'auto', 
  };
  
  if (isPdf) {
    const randomName = Math.random().toString(36).substring(2, 15);
    uploadOptions.public_id = `${randomName}.pdf`;
  }

  const buffer = Buffer.from('dummy pdf content');
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          console.log("UPLOAD RESULT:", result);
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
}
run();
