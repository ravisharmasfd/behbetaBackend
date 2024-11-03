let express = require('express');
const { getProfileMerchant } = require('../controller/profile');


let profileRouter = express.Router();

profileRouter.get("/", getProfileMerchant)

module.exports = profileRouter;
