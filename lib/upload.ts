import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
// Ensure you have these environment variables set:
// CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a File object from FormData to Cloudinary
 * @param file The File object to upload
 * @param folder The folder name in Cloudinary (e.g., 'cms', 'banners')
 * @returns The secure URL of the uploaded image
 */
export async function uploadToCloudinary(file: File, folder: string = 'honda-showroom'): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto', // auto detect image/video
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Cloudinary upload returned null result"));
        }
        resolve(result.secure_url);
      }
    );

    // Write the buffer to the upload stream
    uploadStream.end(buffer);
  });
}

/**
 * Deletes a file from Cloudinary based on its secure URL
 * @param secureUrl The full secure URL of the image
 */
export async function deleteFromCloudinary(secureUrl: string): Promise<void> {
  try {
    // Extract the public ID from the URL
    // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/honda-showroom/abcxyz.jpg
    // We need 'honda-showroom/abcxyz'
    
    // First, let's remove everything up to /upload/
    const urlParts = secureUrl.split('/upload/');
    if (urlParts.length !== 2) return;
    
    // urlParts[1] is like v1234567890/honda-showroom/abcxyz.jpg
    const pathWithVersion = urlParts[1];
    
    // Remove the version part (vXXXXXXXXX/)
    const pathWithoutVersion = pathWithVersion.replace(/^v\d+\//, '');
    
    // Remove the extension (.jpg, .png, etc)
    const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf('.'));
    
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
}
