require("dotenv").config();
require("express-async-errors");

//express
const express = require("express");
const app = express();

//other middleware imports
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

//db
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");

//middlewares
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req, res) => {
  res.send(`E-commerce API home page`);
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async (url) => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, (req, res) => {
      console.log(`App is listening on ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
