var express = require('express');
var router = express.Router();
const authRouter = require("./auth");
const invoiceRouter = require('./invoice');
/* GET home page. */
router.use("/auth", authRouter)
router.use("/invoice", invoiceRouter)
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
