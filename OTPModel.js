const mongoose = require("mongoose");

const sendOTPSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otpCode: {
    type: Number,
    required: true,
  },
  validity: Number,
  createdTime: Number,
});

module.exports = mongoose.model("OTP", sendOTPSchema);
