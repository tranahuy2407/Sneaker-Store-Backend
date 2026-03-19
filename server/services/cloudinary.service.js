import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `PERN_SNEAKER/${folder}`,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(file.buffer); 
  });
};

export const deleteFromCloudinary = async (publicUrl) => {
  if (!publicUrl) return;
  try {
    const match = publicUrl.match(/PERN_SNEAKER\/(.+)\./);
    if (match) {
      const publicId = `PERN_SNEAKER/${match[1]}`;
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};
