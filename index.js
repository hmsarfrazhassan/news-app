import "./config/dotenv.js";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categotyRoutes from "./routes/categoryRoutes.js";

const app = express();
connectDB();

app.use(express.json());
app.use("/api/v1", authRoutes);
app.use("/api/v1/category", categotyRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `Server is running on ${PORT} and in environment ${process.env.NODE_ENV}`,
  );
});
