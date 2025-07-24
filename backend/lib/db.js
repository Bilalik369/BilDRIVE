import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Database connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.log("Error connecting to database ", error);
    process.exit(1)
  }
};
