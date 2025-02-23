const express = require("express");
const uploadMedia = require("../middleware/mediaUploader");
const assetRouter = express.Router();

assetRouter.post("/", uploadMedia.single("media"), (req, res, next) => {
  try {
    return res.json({
      message: "Media successfully upload",
      data: {
        path: req?.file,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = assetRouter;
