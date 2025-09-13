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

     getAllStudents = async (req: Request, res: Response) => {
          try {
               const page = parseInt(req.query.page as string) || 1;
               const limit = parseInt(req.query.limit as string) || 5;
               const students = await this.service.getAllStudents(page, limit);
               const totalStudents = await this.service.getStudentCount();
               res.status(200).json({
                    students,
                    totalStudents,
                    totalPages: Math.ceil(totalStudents / limit),
                    currentPage: page
               });
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
               if (err.message.includes("not found")) {
                    return res.status(404).json({ error: err.message });
               }
               res.status(500).json({ error: err.message });
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

     searchStudents = async (req: Request, res: Response) => {
          const query = req.query.q as string;
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 5;

          if (!query) {
               return this.getAllStudents(req, res);
          }

          try {
               const students = await this.service.searchStudents(query, page, limit);
               const totalStudents = await this.service.getStudentCount(query);
               res.status(200).json({
                    students,
                    totalStudents,
                    totalPages: Math.ceil(totalStudents / limit),
                    currentPage: page
               });
          } catch (err: any) {
               res.status(500).json({ error: err.message });
          }
     };
}

