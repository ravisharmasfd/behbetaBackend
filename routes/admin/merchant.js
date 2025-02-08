var express = require("express");
const {
  createMerchant,
  getMerchants,
  deleteMerchant,
  updateMerchant,
  updatePassword,
} = require("../../controller/admin/merchant");
var adminMerchantRouter = express.Router();

adminMerchantRouter.put("/password/:id", updatePassword);
adminMerchantRouter.post("/", createMerchant);
adminMerchantRouter.get("/", getMerchants);
adminMerchantRouter.delete("/:id", deleteMerchant);
adminMerchantRouter.put("/:id", updateMerchant);

module.exports = adminMerchantRouter;
