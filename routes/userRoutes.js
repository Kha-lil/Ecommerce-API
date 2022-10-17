const express = require("express");
const userRouter = express.Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");
const {authenticateUser} = require("../middleware/authentication");

userRouter.route("/").get(getAllUsers);
userRouter.route("/showMe").get(showCurrentUser);
userRouter.route("/updateUser").patch(updateUser);
userRouter.route("/updateUserPassword").patch(updateUserPassword);

userRouter.route("/:id").get(getSingleUser);

module.exports = userRouter;
