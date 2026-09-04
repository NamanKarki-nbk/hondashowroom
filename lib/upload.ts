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
  
  const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';

  const uploadOptions: any = {
    folder,
    resource_type: isPdf ? 'raw' : 'auto', 
  };
  
  if (isPdf) {
    // For raw files via stream, Cloudinary doesn't know the extension unless we provide a public_id
    // generate a random string + .pdf
    const randomName = Math.random().toString(36).substring(2, 15);
    uploadOptions.public_id = `${randomName}.pdf`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
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
    const isRaw = secureUrl.includes('/raw/upload/');
    const urlParts = secureUrl.split('/upload/');
    if (urlParts.length !== 2) return;
    
    const pathWithVersion = urlParts[1];
    const pathWithoutVersion = pathWithVersion.replace(/^v\d+\//, '');
    
    // For raw files, the publicId INCLUDES the extension.
    // For images, the publicId EXCLUDES the extension.
    let publicId = pathWithoutVersion;
    if (!isRaw) {
      publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf('.'));
    }
    
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: isRaw ? 'raw' : 'image' });
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
}
