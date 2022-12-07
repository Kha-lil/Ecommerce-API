const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.OK).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: _id } = req.params;
  const product = await Product.findById({ _id });
  if (!product) {
    throw new CustomError.NotFoundError(`Can't find product with id:${_id}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: _id } = req.params;
  const product = await Product.findByIdAndUpdate(
    { _id },
    { ...req.body },
    { new: true, runValidators: true }
  );
  if (!product) {
    throw new CustomError.NotFoundError(`Can't find product with id:${_id}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: _id } = req.params;
  const product = await Product.findById({ _id });
  if (!product) {
    throw new CustomError.NotFoundError(`Can't find product with id:${_id}`);
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: `Success! Product removed` });
};

const uploadImage = async (req, res) => {
  console.log(req.files);
  if (!req.files) {
    throw new CustomError.BadRequestError(`No file uploaded`);
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError(`Please upload an Image`);
  }
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      `Please upload an image less than 1MB`
    );
  }
  const imagePath = path.resolve(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
