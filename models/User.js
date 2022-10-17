const mongoose = require("mongoose");
const validator = require("validator");
const CustomError = require("../errors/index");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Please provide name`],
    minlength: 3,
    maxlenght: 50,
  },
  email: {
    type: String,
    required: [true, `Please provide email`],
    validate: {
      validator: validator.isEmail,
      message: `Pleaase provide a valid email`,
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, `Please provide passpwrd`],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
