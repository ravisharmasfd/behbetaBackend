const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../config/cloudinary")

const mediaStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");
    return {
      folder: "mediaUploads",
      resource_type: isVideo ? "video" : "image",
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      format: isVideo ? undefined : "jpg", // Convert images to JPEG, leave videos as is
      transformation: !isVideo
        ? [{ width: 500, height: 500, crop: "limit" }]
        : undefined,
    };
  },
});

const uploadMedia = multer({
  storage: mediaStorage,
  limits: {
    fileSize: 100000000, // 100MB file size limit for both images and videos
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "video/mp4",
      "video/quicktime",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only jpg, png, mp4, and mov are allowed.",
        ),
      );
    }
  },
});

module.exports = uploadMedia;
