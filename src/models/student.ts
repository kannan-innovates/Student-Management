import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudent {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  course: string;
  year: number;
}

export type IStudentDocument = IStudent & Document;

const StudentSchema: Schema<IStudentDocument> = new Schema(
  {
    studentId: { type: String, required: true, unique: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1 },
  },
  {
    timestamps: true,
  }
);

const StudentModel: Model<IStudentDocument> = mongoose.model<IStudentDocument>(
  "Student",
  StudentSchema
);

export default StudentModel;