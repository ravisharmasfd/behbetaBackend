let express = require("express");
const { register, login, authMiddleware } = require("../controller/auth");
const {
  createInvoice,
  getInvoices,
  deleteInvoice,
  generatePaymentSeasonId,
  invoiceStats,
} = require("../controller/invoice");
let invoiceRouter = express.Router();

/* GET users listing. */
invoiceRouter.post("/", authMiddleware(2), createInvoice);
invoiceRouter.get("/", authMiddleware(2), getInvoices);

invoiceRouter.delete("/:id", authMiddleware(2), deleteInvoice);
invoiceRouter.get("/stats", authMiddleware(2), invoiceStats);
invoiceRouter.post("/cancelInvoice/:id", authMiddleware(2), invoiceStats);

module.exports = invoiceRouter;
