import { IStudentRepository } from "../repositories/studentRepository";
import { CreateStudentDTO, UpdateStudentDTO } from "../types/student";

export class StudentService {
  constructor(private repository: IStudentRepository) { }

  async addStudent(data: CreateStudentDTO) {
    if (!data.email.includes("@")) {
      throw new Error("Invalid email format");
    }
    return await this.repository.create(data);
  }

  async getAllStudents() {
    return await this.repository.findAll();
  }

  async getStudentById(id: string) {
    const student = await this.repository.findById(id);
    if (!student) throw new Error("Student not found");
    return student;
  }

  async updateStudent(id: string, data: UpdateStudentDTO) {
    const updated = await this.repository.update(id, data);
    if (!updated) throw new Error("Student not found or update failed");
    return updated;
  }

  async deleteStudent(id: string) {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new Error("Student not found or delete failed");
    return deleted;
  }

  async searchStudents(query: string) {
    return await this.repository.search(query);
  }
}