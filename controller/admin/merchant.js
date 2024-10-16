const User = require("../../model/user");

exports.createMerchant =async (req, res, next) => {
    try {
      // Check if the user already exists
      let user = await User.findOne({ email:req.body.email });
      if (user) {
        return res.status(400).json({ message: 'User already exists with email' });
      }
      let userByMerchantId = await User.findOne({ merchantId:req.body.merchantId });
      if (userByMerchantId) {
        return res.status(400).json({ message: 'User already exists with merchant id' });
      }
      let userByUserName = await User.findOne({ username:req.body.username });
      if (userByUserName) {
        return res.status(400).json({ message: 'User already exists with username' });
      }
  
  
      // Create a new user
      user = new User({
        ...req.body,
        role: 2
      });
  
      // Save the user to the database
      await user.save();
  
      res.json({ data:user,message:"New Merchant created successfully" });
    } catch (error) {
      console.error(error);
      next(error)
    }
  }
  exports.getMerchants = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1; // Default to 1 if not provided
      const limit = parseInt(req.query.limit) || 10; // Default to 10 if not provided
      const skip = (page - 1) * limit;
  
      // Fetch merchants with pagination
      const merchants = await User.find({ role: 2 , isDeleted:false}) // Assuming role 2 means Merchant
        .skip(skip)
        .limit(limit)
        .exec();
  
      // Count total documents for pagination info
      const total = await User.countDocuments({ role: 2 });
  
      res.json({
        data: merchants,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalMerchants: total
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
  exports.updateMerchant = async (req, res, next) => {
    try {
      const merchantId = req.params.id;
  
      // Check if merchant exists
      let merchant = await User.findById(merchantId);
      if (!merchant || merchant.role !== 2) {
        return res.status(404).json({ message: 'Merchant not found' });
      }
  
      // Update merchant with new data
      merchant = await User.findByIdAndUpdate(merchantId, req.body, {
        new: true, // return the updated document
        runValidators: true // ensure the update respects the schema validation
      });
  
      res.json({ data: merchant, message: "Merchant updated successfully" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
  exports.deleteMerchant = async (req, res, next) => {
    try {
      const merchantId = req.params.id;
  
      // Check if merchant exists and is not already soft-deleted
      let merchant = await User.findOneAndUpdate({_id:merchantId,role:2},{isDeleted:true});
      if (!merchant) {
        return res.status(404).json({ message: 'Merchant not found' });
      }
  
      res.json({ message: "Merchant deleted successfully" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
  
    