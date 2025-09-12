import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();

const app: Application = express();
app.use(express.json());

// simple health route
app.get("/", (req: Request, res: Response) => {
     res.status(200).json({ message: "Student Management API — up" });
});

const PORT = process.env.PORT || 3000;

const start = async (): Promise<void> => {
     await connectDB();
     app.listen(PORT, () => {
          console.log(`Server listening on port ${PORT}`);
     });
};

start().catch((err) => {
     console.error("Failed to start:", err);
     process.exit(1);
});