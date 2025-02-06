import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in env variables");
    }

    const conn = await mongoose.connect(uri);
    console.log(`MONGODB successfully connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Failed connection to a database", error.message);
      console.log("Stack trace:", error.stack);
    } else {
      console.log("Failed connection to a database", error);
    }

    process.exit(1);
  }
};
