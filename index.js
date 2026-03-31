import "./config/dotenv.js";
import express from "express";
import connectDB from "./config/db.js";

const app = express();

app.use(express.json());
connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `Server is running on ${PORT} and in environment ${process.env.NODE_ENV}`,
  );
});
