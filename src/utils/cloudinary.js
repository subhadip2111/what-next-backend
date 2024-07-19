import cloudinary from 'cloudinary';
import dotenv from 'dotenv'; // Assuming you're using environment variables
dotenv.config(); // Load environment variables

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (filePath, folderName) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
    });
    return result.secure_url;
  } catch (error) {
    console.error(error);
    throw new Error('Error uploading image to Cloudinary');
  }
};

// You can add other Cloudinary interaction functions here as needed
