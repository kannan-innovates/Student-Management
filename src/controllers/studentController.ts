import { Request, Response } from "express";
import { StudentService } from "../services/studentService";
import { CreateStudentDTO, UpdateStudentDTO } from "../types/student";

export class StudentController {
     constructor(private service: StudentService) { }

     createStudent = async (req: Request, res: Response) => {
          try {
               const data: CreateStudentDTO = req.body;
               const student = await this.service.addStudent(data);
               res.status(201).json(student);
          } catch (err: any) {
               res.status(400).json({ error: err.message });
          }
     };

     getAllStudents = async (_req: Request, res: Response) => {
          try {
               const students = await this.service.getAllStudents();
               res.status(200).json(students);
          } catch (err: any) {
               res.status(500).json({ error: err.message });
          }
     };

     getStudentById = async (req: Request, res: Response) => {
          try {
               const student = await this.service.getStudentById(req.params.id);
               res.status(200).json(student);
          } catch (err: any) {
               res.status(404).json({ error: err.message });
          }
     };

     updateStudent = async (req: Request, res: Response) => {
          try {
               const data: UpdateStudentDTO = req.body;
               const updated = await this.service.updateStudent(req.params.id, data);
               res.status(200).json(updated);
          } catch (err: any) {
               res.status(400).json({ error: err.message });
          }
     };

     deleteStudent = async (req: Request, res: Response) => {
          try {
               await this.service.deleteStudent(req.params.id);
               res.status(200).json({ message: "Student deleted successfully" });
          } catch (err: any) {
               res.status(400).json({ error: err.message });
          }
     };
}