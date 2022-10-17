const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { attachCookiesToResponse } = require("../utils");

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
  // const tokenUser = { name: user.name, userId: user._id, role: user.role };
  // attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.send(`showCurrentUser `);
};

const updateUser = async (req, res) => {
  res.send(`updateUser `);
};

const updateUserPassword = async (req, res) => {
  res.send(`updateUserPassword`);
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
