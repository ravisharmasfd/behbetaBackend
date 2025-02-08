let express = require("express");
const adminMerchantRouter = require("./merchant");
const profileRouter = require("./profile");
const adminInvoiceRouter = require("./invoice");
let adminRouter = express.Router();

adminRouter.use("/merchant", adminMerchantRouter);
adminRouter.use("/profile", profileRouter);
adminRouter.use("/invoice", adminInvoiceRouter);

module.exports = adminRouter;
