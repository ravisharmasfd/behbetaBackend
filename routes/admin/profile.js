var express = require('express');
const { getProfile } = require('../../controller/admin/profile');

var profileRouter = express.Router();

profileRouter.get("/", getProfile)

module.exports = profileRouter;
