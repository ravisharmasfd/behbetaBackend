// getting-started.js
const mongoose = require("mongoose");
const { mongoUrl } = require("../config/env");

exports.connectDatabase = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("database is connected");
  } catch (error) {
    console.log("🚀 ~ exports.connectDatabase= ~ error:", error);
  }
};
