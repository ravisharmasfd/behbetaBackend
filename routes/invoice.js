var express = require('express');
const { register, login } = require('../controller/auth');
const { createInvoice, getInvoices } = require('../controller/invoice');
var invoiceRouter = express.Router();

/* GET users listing. */
invoiceRouter.post('/', createInvoice);
invoiceRouter.get("/",getInvoices);

module.exports = invoiceRouter;
