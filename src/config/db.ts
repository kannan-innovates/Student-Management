import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
     const mongoURI = process.env.MONGODB_URI;
     if (!mongoURI) {
          console.error("MONGO_URI not set in .env");
          process.exit(1);
     }

     try {
          const conn = await mongoose.connect(mongoURI);
          console.log(`MongoDB connected: ${conn.connection.host}`);
     } catch (error: any) {
          console.error("MongoDB connection error:", error.message ?? error);
          process.exit(1);
     }
};

export default connectDB;