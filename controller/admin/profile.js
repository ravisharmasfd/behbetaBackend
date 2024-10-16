const getProfile = async (req, res, next) => {
    try {
      const adminData = req.user.toObject();
      delete adminData.password;
      res.json(adminData);
    } catch (error) {
      next(error);
    }
  };


  module.exports = {
    getProfile
  }