var express = require('express');
const { register, login } = require('../controller/auth');
var router = express.Router();

/* GET users listing. */
router.post('/register', register);
router.post('/login', login);

module.exports = router;
