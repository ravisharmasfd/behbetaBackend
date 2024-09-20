var express = require('express');
const { register, login } = require('../controller/auth');
const { createInvoice, getInvoices, deleteInvoice } = require('../controller/invoice');
var invoiceRouter = express.Router();

/* GET users listing. */
invoiceRouter.post('/', createInvoice);
invoiceRouter.get("/",getInvoices);
invoiceRouter.delete("/:id",deleteInvoice);

module.exports = invoiceRouter;
