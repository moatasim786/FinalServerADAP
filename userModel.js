const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: String,
  createdTime: Number,
  provider: String,
  userName: String,
  wallet: String,
  option: String,
  data: Object,
  options: [{ option: String, wallet: String }]
});

module.exports = mongoose.model("userData", userSchema);
