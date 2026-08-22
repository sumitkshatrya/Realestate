import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  try {
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not configured");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected...");
    return true;
  } catch (error) {
    const shouldFallbackToMemory =
      process.env.NODE_ENV !== "production" &&
      (!mongoUri ||
        error?.code === "ENOTFOUND" ||
        error?.name === "MongooseServerSelectionError");

    if (shouldFallbackToMemory) {
      try {
        const memoryServer = await MongoMemoryServer.create({
          binary: {
            version: "7.0.14",
          },
          instance: {
            dbName: "realestate",
          },
        });
        await mongoose.connect(memoryServer.getUri());
        console.log("MongoDB connected using fallback in-memory server...");
        return true;
      } catch (memoryError) {
        console.warn(
          "MongoDB memory fallback failed. Starting server without a database connection.",
          memoryError.message || memoryError
        );
        return false;
      }
    }

    console.warn(
      "MongoDB connection failed. Starting server without a database connection.",
      error.message || error
    );
    return false;
  }
};

export default connectDB;
