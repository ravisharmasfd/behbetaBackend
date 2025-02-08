let express = require("express");
const { register, login } = require("../controller/auth");
let router = express.Router();

/* GET users listing. */
router.post("/register", register);
router.post("/login", login);

module.exports = router;
