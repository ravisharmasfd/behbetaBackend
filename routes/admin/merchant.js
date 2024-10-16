var express = require('express');
const { createMerchant, getMerchants, deleteMerchant, updateMerchant } = require('../../controller/admin/merchant');
var adminMerchantRouter = express.Router();

adminMerchantRouter.post("/", createMerchant)
adminMerchantRouter.get("/", getMerchants)
adminMerchantRouter.delete("/:id", deleteMerchant)
adminMerchantRouter.put("/:id", updateMerchant)

module.exports = adminMerchantRouter;
