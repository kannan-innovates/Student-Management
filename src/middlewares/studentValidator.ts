// src/middlewares/studentValidator.ts
import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import StudentModel from '../models/Student';

// Validation rules for creating and updating a student
export const studentValidationRules = (): ValidationChain[] => {
     return [
          body('studentId')
               .trim()
               .notEmpty().withMessage('Student ID is required.')
               .custom(async (value, { req }) => {
                    // Check for uniqueness, but allow the user to keep their own ID on update
                    const existingStudent = await StudentModel.findOne({ studentId: value });
                    if (existingStudent && existingStudent.id.toString() !== req.params?.id) {
                         throw new Error('Student ID already exists.');
                    }
                    return true;
               }),

          body('firstName')
               .trim()
               .notEmpty().withMessage('First Name is required.'),

          body('lastName')
               .trim()
               .notEmpty().withMessage('Last Name is required.'),

          body('email')
               .trim()
               .notEmpty().withMessage('Email is required.')
               .isEmail().withMessage('Please provide a valid email address.')
               .normalizeEmail()
               .custom(async (value, { req }) => {
                    // Check for uniqueness, but allow user to keep their own email on update
                    const existingStudent = await StudentModel.findOne({ email: value });
                    if (existingStudent && existingStudent.id.toString() !== req.params?.id) {
                         throw new Error('Email is already in use.');
                    }
                    return true;
               }),

          body('phone')
               .trim()
               .notEmpty().withMessage('Phone number is required.')
               .isMobilePhone('any', { strictMode: false }).withMessage('Please provide a valid phone number.'),

          body('course')
               .trim()
               .notEmpty().withMessage('Course is required.'),

          body('year')
               .notEmpty().withMessage('Year is required.')
               .isInt({ min: 1, max: 5 }).withMessage('Year must be a number between 1 and 5.')
     ];
};

// Middleware to handle the validation result
export const validate = (req: Request, res: Response, next: NextFunction) => {
     const errors = validationResult(req);
     if (errors.isEmpty()) {
          return next();
     }

     // Extract and format errors
     const extractedErrors: { [key: string]: string } = {};
     errors.array().forEach(err => {
          if ('path' in err) { // Use type guard to ensure 'path' exists
               extractedErrors[err.path] = err.msg;
          }
     });

     // Return a 422 Unprocessable Entity status with the errors
     return res.status(422).json({
          errors: extractedErrors,
     });
};