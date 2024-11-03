let express = require('express');
const { getProfile } = require('../../controller/admin/profile');

let profileRouter = express.Router();

profileRouter.get("/", getProfile)

module.exports = profileRouter;
