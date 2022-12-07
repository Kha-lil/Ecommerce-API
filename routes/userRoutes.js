const express = require("express");
const userRouter = express.Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

userRouter
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers);
userRouter.route("/showMe").get(authenticateUser, showCurrentUser);
userRouter.route("/updateUser").patch(authenticateUser, updateUser);
userRouter.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);

userRouter.route("/:id").get(authenticateUser, getSingleUser);

module.exports = userRouter;
