let express = require("express");
const { getProfileMerchant, inviteUser } = require("../controller/profile");

let profileRouter = express.Router();

profileRouter.get("/", getProfileMerchant);
profileRouter.post("/", inviteUser);

module.exports = profileRouter;
