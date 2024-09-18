require('dotenv').config()

exports.mongoUrl = process.env.MONGO_URL
exports.port = process.env.PORT
exports.jwtSecret = process.env.JWT_SECRET