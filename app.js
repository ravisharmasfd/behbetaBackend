var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors")
var indexRouter = require('./routes/index');
const cron = require('node-cron');
const moment = require("moment");

const Invoice = require('./model/invoice');

var app = express();

app.use(cors())
// view engine setup
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});
app.use('/api', indexRouter);
// app.get('/payment2/:sessionId', (req, res) => {
//   const { sessionId } = req.params;

//   // Render an HTML page for the payment process
//   res.send(`
//     <html>
//       <head>
//         <script src="https://afs.gateway.mastercard.com/static/checkout/checkout.min.js" data-error="errorCallback" data-cancel="cancelCallback"
//         data-complete="completeCallback"
//         ></script>
//         <script type="text/javascript">
//           function errorCallback(error) {
//             console.log("error is ====>>>",JSON.stringify(error));
//           }

//           function cancelCallback() {
//             console.log("invoiceRouter cancel",'Payment cancelled');
//           }
//           function completeCallback(data) {
//       console.log('Payment completed',data);
//     }

//           // Configuring checkout session
//           Checkout.configure({
//             session: {
//               id: '${sessionId}'  // Using the session ID passed from the server
//             }
//           });
//         </script>
//       </head>
//       <body>
//         <div id="embed-target"></div>
//         <input type="button" value="Pay with Embedded Page" onclick="Checkout.showEmbeddedPage('#embed-target');" />
//         <input type="button" value="Pay with Payment Page" onclick="Checkout.showPaymentPage();" />
//       </body>
//     </html>
//   `);
// });

// // catch 404 and forward to error handler
// app.get('/payment/:sessionId', (req, res) => {
//   const { sessionId } = req.params;

//   // Render the EJS template for the payment page
//   res.render('payment', { sessionId });  // Pass the sessionId to the EJS template
// });
app.use(function (req, res, next) {
  next(res.status(404).json({message:"Not Found"}));
});

// error handler
app.use(function (err, req, res, next) {
  console.log("🚀 ~ app.use ~ err:", err)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

 // // cron job
 cron.schedule('0 10 * * *', async () => {
  console.log('Running a task every day at 10 AM');
 try{
  const startOfToday = moment().startOf('day').toDate();
  console.log("🚀 ~ cron.schedule ~ startOfToday:", startOfToday)
  const endOfToday = moment().endOf('day').toDate();
  console.log("🚀 ~ cron.schedule ~ endOfToday:", endOfToday)
  const invoices = await Invoice.find({
    startDate: {
      $gte: startOfToday, // Greater than or equal to the start of today
      $lt: endOfToday     // Less than the end of today
    },
    type: 2,
    cronJobDone: false

  }).populate("user_id")
  console.log("🚀 ~ cron.schedule ~ invoices:", invoices)
  let updates = await Invoice.updateMany({
    startDate: {
      $gte: startOfToday, // Greater than or equal to the start of today
      $lt: endOfToday     // Less than the end of today
    },
    type: 2,
    cronJobDone: false

  }, {
    $set: {
      cronJobDone: true
    }
  })
  console.log("🚀 ~ cron.schedule ~ updates:", updates)
  const newInvoicesPromise = [];
  const sendSmsPromise = [];
  const sendEmailPromise = [];
  invoices.forEach(inv => {
    const body = inv.toObject();
    const url = `${"http://localhost:3000/payment?sessionId="}${inv._id}`
    const newDate = moment(body.invoice_start_date).add(repeat_every, frequencyUnit);
    let nextInvoice = new Invoice({
      ...body, invoice_start_date: newDate,
    });
    newInvoicesPromise.push(nextInvoice.save());
    if (body.sendAtMail) {

      sendSmsPromise.push(sendEmail(body.email,url,body.amount,body?.user_id?.businessName))
    }
    if (body.sendAtSMS) {
      sendSmsPromise(sendSms(body?.country_code + body?.mobile_no,  `You have received an order from ${body?.user_id?.businessName} for an amount of ${body?.amount} BHD. Pay using:${url}`))
    }
  })
  const invoicesData = await Promise.all(newInvoicesPromise);
  console.log("🚀 ~ cron.schedule ~ invoicesData:", invoicesData)
  const sendSmsData = await Promise.all(sendSmsPromise);
  console.log("🚀 ~ cron.schedule ~ sendSmsData:", sendSmsData)
  const sendEmailData = await Promise.all(sendEmailPromise);
  console.log("🚀 ~ cron.schedule ~ sendEmailData:", sendEmailData)
 }catch(err){
  console.log("🚀 ~ cron.schedule ~ err:", err)
  
 }
});
module.exports = app;


