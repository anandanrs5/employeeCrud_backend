const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  phone: Number,
  password: String,
});

userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email }).exec();
};

const Users = mongoose.model("users", userSchema);

module.exports = Users;
