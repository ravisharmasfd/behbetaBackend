var express = require('express');
const adminMerchantRouter = require('./merchant');
const profileRouter = require('./profile');
var adminRouter = express.Router();

adminRouter.use("/merchant", adminMerchantRouter)
adminRouter.use("/profile", profileRouter)

module.exports = adminRouter;
