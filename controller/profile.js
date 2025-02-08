const { sendInviteEmail } = require("../helper/payment");

const getProfileMerchant = async (req, res, next) => {
  try {
    const merchantData = req.user.toObject();
    delete merchantData.password;
    res.json(merchantData);
  } catch (error) {
    next(error);
  }
};

const inviteUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    await sendInviteEmail(email, req.user, name);
    res.json({});
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfileMerchant,
  inviteUser,
};
