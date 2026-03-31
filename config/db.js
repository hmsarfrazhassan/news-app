import mongoose from "mongoose";

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.DB_URI);
  console.log(`DB connected: ${conn.connection.host}`);
};

export default connectDB;
