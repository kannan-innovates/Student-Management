import StudentModel, { IStudentDocument, IStudent } from "../models/Student";
import { CreateStudentDTO, UpdateStudentDTO } from "../types/student";

export interface IStudentRepository {
  create(data: CreateStudentDTO): Promise<IStudentDocument>;
  findAll(): Promise<IStudentDocument[]>;
  findById(id: string): Promise<IStudentDocument | null>;
  update(id: string, data: UpdateStudentDTO): Promise<IStudentDocument | null>;
  delete(id: string): Promise<IStudentDocument | null>;
}

export class StudentRepository implements IStudentRepository {
  async create(data: CreateStudentDTO): Promise<IStudentDocument> {
    return await StudentModel.create(data);
  }

  async findAll(): Promise<IStudentDocument[]> {
    return await StudentModel.find();
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
}