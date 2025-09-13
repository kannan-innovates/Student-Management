import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db";
import studentRoutes from "./routes/studentRoutes";
import { StudentController } from "./controllers/studentController"; // Import the controller
import { StudentService } from "./services/studentService"; // Import the service
import { StudentRepository } from "./repositories/studentRepository"; // Import the repository

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

// Set up the repository, service, and controller for the view route
const studentRepository = new StudentRepository();
const studentService = new StudentService(studentRepository);
const studentController = new StudentController(studentService);

// ---------------------------
// NEW ROUTE FOR THE EJS VIEW
// ---------------------------
app.get("/", async (req: Request, res: Response) => {
  try {
    const students = await studentService.getAllStudents();
    res.render("home", { students });
  } catch (error) {
    console.error("Failed to fetch students for home page:", error);
    res.status(500).send("An error occurred while loading the page.");
  }
});
// ---------------------------

app.use("/api", studentRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});