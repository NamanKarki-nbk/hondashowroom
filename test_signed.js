const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env' });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const url = cloudinary.utils.url('honda-showroom/finance-pdfs/touszrutrpioylpyrro1.pdf', { sign_url: true, resource_type: 'image' });
console.log('SIGNED URL:', url);
