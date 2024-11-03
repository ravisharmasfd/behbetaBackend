let express = require('express');

const { getAdminInvoices } = require('../../controller/admin/invoice');
let adminInvoiceRouter = express.Router();

/* GET users listing. */
// adminInvoiceRouter.post('/', createInvoice);
adminInvoiceRouter.get("/",getAdminInvoices);
// adminInvoiceRouter.delete("/:id",deleteInvoice);

module.exports = adminInvoiceRouter;
