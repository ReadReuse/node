const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localFilePath, fileName) => {
  let mainFolderName = "readreuse";

  return cloudinary.uploader
    .upload(localFilePath, {
      public_id: fileName,
      folder: mainFolderName,
      overwrite: false,
    })
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

const deleteFromCloudinary = async (public_id) => {
  return cloudinary.uploader
    .destroy(public_id)
    .then((result) => {
      return {
        success: true,
        result: result,
      };
    })
    .catch((err) => {
      return {
        success: false,
        err,
      };
    });
};

const checkCloudinaryAsset = async (fileName, folderName) => {
  const public_id = (folderName || "readreuse") + "/" + fileName;

  return cloudinary.api
    .resource(public_id)
    .then((result) => {
      console.log(result);
      return {
        success: true,
        result: result,
      };
    })
    .catch((err) => {
      return {
        success: false,
        err,
      };
    });
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  checkCloudinaryAsset,
};
