import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.config.js";
import { notFound, errorHandler } from "./middlewares/index.js";
import API from "./api/index.js";
import { generateResponse } from "./utils/helpers.js";

// initialize environment variables
dotenv.config();

// initialize express app
const app = express();

// connect to database
connectDB();

// set up middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors({ origin: "*", credentials: true }));

app.post('/', (req, res) => {
  console.log('req.body >>>>>>>>>', req.body);
  generateResponse(req.body, `${process.env.APP_NAME} API v2.0 - Health check passed`, res);
});   

app.get('/', (req, res) => {
  console.log("API is called!");
  console.log(`API Calling from ${req?.ip}`);
  generateResponse(null, `${process.env.APP_NAME} API v2.0 - Health check passed`, res);
});

const appRoutes = new API(app);
appRoutes.registerGroups();

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode ? err.statusCode : 500;
  const error = new Error(err?.message.replace(/\"/g, '') || 'Internal Server Error');

  return res.status(statusCode).json({
    message: error?.message,
    statusCode: statusCode,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`.yellow.bold);
});
