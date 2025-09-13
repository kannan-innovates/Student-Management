export interface CreateStudentDTO {
     studentId: string;
     firstName: string;
     lastName: string;
     email: string;
     phone: string;
     course: string;
     year: number;
}

export interface UpdateStudentDTO {
     firstName?: string;
     lastName?: string;
     email?: string;
     phone?: string;
     course?: string;
     year?: number;
}