let express = require('express');
const { register, login } = require('../controller/auth');
const { createInvoice, getInvoices, deleteInvoice, generatePaymentSeasonId } = require('../controller/invoice');
let invoiceRouter = express.Router();

/* GET users listing. */
invoiceRouter.post('/', createInvoice);
invoiceRouter.get("/",getInvoices);
invoiceRouter.get("/session/:id",generatePaymentSeasonId);
invoiceRouter.delete("/:id",deleteInvoice);

module.exports = invoiceRouter;
