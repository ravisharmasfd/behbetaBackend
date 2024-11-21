require('dotenv').config()

exports.mongoUrl = process.env.MONGO_URL
exports.port = process.env.PORT
exports.jwtSecret = process.env.JWT_SECRET
exports.merchantId = process.env.MERCHANT_ID
exports.mailHost = process.env.MAIL_HOST
exports.mailPort = process.env.MAIL_PORT
exports.mailUser = process.env.MAIL_USER
exports.mailPass = process.env.MAIL_PASS
exports.mail = process.env.MAIL
exports.smsClientID = process.env.SMS_CLIENTID
exports.smsPass = process.env.SMS_PASSWORD
exports.smsToken = process.env.SMS_TOKEN