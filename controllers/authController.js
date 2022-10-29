const User = require("../models/User");
const { createTokenUser, attachCookiesToResponse } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const CustomErrors = require("../errors");

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const isEmailTaken = await User.findOne({ email });
  if (isEmailTaken) {
    throw new CustomErrors.BadRequestError(
      `Email is already in use by someone else, please use another email or Log in with your email.`
    );
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ email, name, password, role });
  const tokenUser = createTokenUser(user)

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomErrors.BadRequestError(`Please provide email and password`);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomErrors.UnauthenticatedError("User does not exist");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomErrors.UnauthenticatedError(
      "please provide valid credentials"
    );
  }

  const tokenUser = createTokenUser(user)

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  const expireTime = 5 * 1000;
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + expireTime),
  });
  res.status(StatusCodes.OK).send(`user logged out`);
};

module.exports = {
  register,
  login,
  logout,
};
