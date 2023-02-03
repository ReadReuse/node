const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configuration
cloudinary.config({
  cloud_name: "dwv7fnwns",
  api_key: "838723546365578",
  api_secret: "BnxOHb9QsbKdhWcoPCHrFS5lwt8",
});

const uploadToCloudinary = async (localFilePath) => {
  let mainFolderName = "readreuse";

  return cloudinary.uploader
    .upload(localFilePath, { public_id: mainFolderName + "/" + localFilePath })
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
