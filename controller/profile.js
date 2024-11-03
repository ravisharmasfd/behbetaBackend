const getProfileMerchant = async (req, res, next) => {
  try {
    const merchantData = req.user.toObject();
    delete merchantData.password;
    res.json(merchantData);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getProfileMerchant
}