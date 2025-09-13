import { Router } from "express";
import { StudentController } from "../controllers/studentController";
import { StudentService } from "../services/studentService";
import { StudentRepository } from "../repositories/studentRepository";

// Create repository → service → controller 
const repository = new StudentRepository();
const service = new StudentService(repository);
const controller = new StudentController(service);

const router = Router();

// Student CRUD routes
router.post("/students", controller.createStudent);
router.get("/students", controller.getAllStudents);
router.get("/students/:id", controller.getStudentById);
router.put("/students/:id", controller.updateStudent);
router.delete("/students/:id", controller.deleteStudent);

export default router;