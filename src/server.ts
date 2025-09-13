import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import studentRoutes from "./routes/studentRoutes";

dotenv.config();
const app = express();
app.use(express.json());


app.use("/", studentRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
     await connectDB();
     app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
     });
};

startServer().catch((err) => {
     console.error("Server failed to start:", err);
     process.exit(1);
});