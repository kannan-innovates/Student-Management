// repositories/studentRepository.ts

import StudentModel, { IStudentDocument, IStudent } from "../models/Student";
import { CreateStudentDTO, UpdateStudentDTO } from "../types/student";

export interface IStudentRepository {
  create(data: CreateStudentDTO): Promise<IStudentDocument>;
  findAll(page: number, limit: number): Promise<IStudentDocument[]>;
  findById(id: string): Promise<IStudentDocument | null>;
  update(id: string, data: UpdateStudentDTO): Promise<IStudentDocument | null>;
  delete(id: string): Promise<IStudentDocument | null>;
  search(query: string, page: number, limit: number): Promise<IStudentDocument[]>;
  countStudents(query?: string): Promise<number>;
}

export class StudentRepository implements IStudentRepository {
  async create(data: CreateStudentDTO): Promise<IStudentDocument> {
    return await StudentModel.create(data);
  }

  async findAll(page: number, limit: number): Promise<IStudentDocument[]> {
    const skip = (page - 1) * limit;
    return await StudentModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
  }

  async findById(id: string): Promise<IStudentDocument | null> {
    return await StudentModel.findById(id);
  }

  async update(id: string, data: UpdateStudentDTO): Promise<IStudentDocument | null> {
    return await StudentModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IStudentDocument | null> {
    return await StudentModel.findByIdAndDelete(id);
  }

  async search(query: string, page: number, limit: number): Promise<IStudentDocument[]> {
    const regex = new RegExp(query, 'i');
    const skip = (page - 1) * limit;
    return await StudentModel.find({
      $or: [
        { studentId: { $regex: regex } },
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } }
      ]
    }).skip(skip).limit(limit);
  }

  async countStudents(query?: string): Promise<number> {
    if (query) {
      const regex = new RegExp(query, 'i');
      return await StudentModel.countDocuments({
        $or: [
          { studentId: { $regex: regex } },
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } }
        ]
      });
    }
    return await StudentModel.countDocuments();
  }
}