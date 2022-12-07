const express = require("express");
const reviewRouter = express.Router();
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const {
  authenticateUser,
} = require("../middleware/authentication");

reviewRouter.route("/").get(getAllReviews).post(authenticateUser, createReview);
reviewRouter
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

module.exports = reviewRouter;
