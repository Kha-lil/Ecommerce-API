const express = require("express");
const productRouter = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");

const { getSingleProductReviews } = require("../controllers/reviewController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

productRouter
  .route("/")
  .post([authenticateUser, authorizePermissions("admin")], createProduct)
  .get(getAllProducts);

productRouter
  .route("/uploadImage")
  .post([authenticateUser, authorizePermissions("admin")], uploadImage);

productRouter
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions("admin")], updateProduct)
  .delete([authenticateUser, authorizePermissions("admin")], deleteProduct);

productRouter.route("/:id/reviews").get(getSingleProductReviews);

module.exports = productRouter;
