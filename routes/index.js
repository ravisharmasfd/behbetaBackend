var express = require('express');
var router = express.Router();
const authRouter = require("./auth");
const invoiceRouter = require('./invoice');
const adminRouter = require("./admin/index.js");
const { authMiddleware } = require('../controller/auth.js');
const profileRouter = require('./profile.js');
const { generatePaymentSeasonId, checkPaymentStatus } = require('../controller/invoice.js');
/* GET home page. */
router.get("/status/:id",checkPaymentStatus)
router.get("/session/:id",generatePaymentSeasonId);
router.use("/admin",authMiddleware(1), adminRouter)
router.use("/auth", authRouter)
router.use("/profile",authMiddleware(2), profileRouter)
router.use("/invoice", invoiceRouter)
module.exports = router;
