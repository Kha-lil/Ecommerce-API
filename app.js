require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

//db
const connectDB = require('./db/connect')

const port = process.env.PORT || 3000;

const start = async (url) => {
  try {
    await connectDB(process.env.MONGO_URI)
  app.listen(port, (req, res) => {
    console.log(`App is listening on ${port}`);
  });
  } catch (error) {
    console.log(error)
  }
};

start();
