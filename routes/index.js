var express = require('express');
var router = express.Router();
const authRouter = require("./auth");
const invoiceRouter = require('./invoice');
const adminRouter = require("./admin/index.js");
const { authMiddleware } = require('../controller/auth.js');
/* GET home page. */
router.use("/admin",authMiddleware(1), adminRouter)
router.use("/auth", authRouter)
router.use("/invoice", invoiceRouter)
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
