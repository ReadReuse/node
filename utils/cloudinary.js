const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localFilePath, fileName) => {
  let mainFolderName = "readreuse";

  return cloudinary.uploader
    .upload(localFilePath, { public_id: fileName, folder: mainFolderName })
    .then((result) => {
      fs.unlinkSync(localFilePath);

      return {
        success: true,
        fileData: result,
      };
    })
    .catch((err) => {
      fs.unlinkSync(localFilePath);
      return {
        success: false,
        err,
      };
    });
};

module.exports = uploadToCloudinary;
