const Review = require("../models/Review");
const Product = require("../models/Product");
const User = require("../models/User");

const { checkPermissions } = require("../utils");

const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createReview = async (req, res) => {
  if (!req.body.product) {
    throw new CustomError.BadRequestError("Please provide product id");
  }
  await checkIfProductExists(req.body.product);
  await checkIfUserAlreadyReview(req.body.product, req.user.userId);
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);

  res.status(StatusCodes.OK).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });
  res.status(StatusCodes.CREATED).json({ reviews, count: reviews.length });
};

// const getSingleReview = async (req, res) => {
//   const { id: _id } = req.params;
//   checkPermissions(req.user, _id);
//   const review = await Review.findOne({_id})

//   res.status(StatusCodes.OK).json({ review });
// };

const getSingleReview = async (req, res) => {
  const { id: _id } = req.params;
  const review = await Review.findOne({ _id });
  if (!review) {
    throw new CustomError.NotFoundError(`Review with id:${_id} does not exist`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: _id } = req.params;
  const review = await Review.findById({ _id });
  if (!review) {
    throw new CustomError.NotFoundError("Review does not exist");
  }
  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({});
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const checkIfProductExists = async (productId) => {
  const product = await Product.findById({ _id: productId });
  if (!product) {
    throw new CustomError.BadRequestError(
      `Product with id:${productId} does not exist`
    );
  }
  return;
};

const checkIfUserAlreadyReview = async (product, user) => {
  const review = await Review.findOne({ product, user });
  if (review) {
    throw new CustomError.BadRequestError(
      `You've already provided a review on product with id:${product}`
    );
  }
  return;
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
