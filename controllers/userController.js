const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { attachCookiesToResponse, createTokenUser,checkPermissions } = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const { id: _id } = req.params;

  const user = await User.findById({ _id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(
      `User cannot be found with id: ${_id}, please enter a valid user id`
    );
  }

  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError("Please provide email");
  }

  if (!name) {
    throw new CustomError.BadRequestError("Please provide name");
  }

  const user = await User.findByIdAndUpdate(
    { _id: req.user.userId },
    { name, email },
    { new: true, runValidators: true }
  );

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Password not provided");
  }

  const user = await User.findById({ _id: req.user.userId });

  const isPasswaordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswaordCorrect) {
    throw new CustomError.UnauthenticatedError("Old password not correct");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
