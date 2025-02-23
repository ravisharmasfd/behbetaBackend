const cloudinary = require("cloudinary").v2;

const {
  cloudinaryCloudName,
  cloudinaryCloudKey,
  cloudinaryCloudSecret,
} = require("./env");

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryCloudKey,
  api_secret: cloudinaryCloudSecret,
});
module.exports = cloudinary;
