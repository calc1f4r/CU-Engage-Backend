import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath: any) => {
  try {
    if (!localFilePath) return;
    // Upload
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath); // Delete local file
    return result;
  } catch (err) {
    // Delete local file
    fs.unlinkSync(localFilePath);
    throw err; // Throw the error to be handled outside this function
  }
};
