const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env' });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
cloudinary.uploader.upload('package.json', { resource_type: 'raw', folder: 'honda-showroom/finance-pdfs' })
  .then(res => console.log('RAW URL:', res.secure_url))
  .catch(console.error);
