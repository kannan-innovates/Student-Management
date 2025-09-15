# Student Management System

A full-stack CRUD (Create, Read, Update, Delete) web application for managing student records.  
This project is built with **TypeScript** using the **MEN-T stack** (MongoDB, Express.js, Node.js, TypeScript) with **EJS** for server-side rendering.

It serves as a practical demonstration of modern web development principles, including a layered architecture, dependency injection, asynchronous operations, and server-side validation.

---

## ✨ Features

- **Full CRUD Functionality**: Add, view, edit, and delete student records.  
- **Server-Side Pagination**: Efficiently handles large datasets by loading students page by page.  
- **Live Search**: Instantly filter and find students by their ID or name.  
- **Robust Server-Side Validation**: Ensures data integrity with inline error messages on the frontend.  
- **Modern UI Notifications**: User-friendly alerts and confirmations powered by SweetAlert2.  
- **Layered Architecture**: A clean separation of concerns into Controllers, Services, and Repositories.  
- **Dependency Injection**: Promotes loose coupling and makes the application easier to test and maintain.  
- **Asynchronous Operations**: Uses async/await for non-blocking database interactions, ensuring a responsive application.  

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript  
- **Database**: MongoDB with Mongoose ODM  
- **Frontend**: EJS (Embedded JavaScript templates), Vanilla JavaScript (ES6+), CSS  
- **Validation**: express-validator  
- **Development Tools**: ts-node-dev for hot-reloading, dotenv for environment variables  

---

## 📂 Project Structure

The project follows a well-organized, feature-driven folder structure that separates concerns effectively.

```bash
src/
├─ config/         # DB connection, env config
├─ controllers/    # Request → Response mapping
├─ services/       # Business logic
├─ repositories/   # DB queries (Mongo/Mongoose)
├─ models/         # Mongoose schemas
├─ routes/         # Express route definitions
├─ middlewares/    # Error handling, validation, auth
├─ views/          # EJS templates
├─ public/         # Static assets (CSS, client-side JS)
├─ types/          # TS interfaces, DTOs
└─ server.ts       # Application entry point

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- **Node.js**: Version 18.x or later  
- **npm**: Included with Node.js  
- **MongoDB**: A running instance of MongoDB (local installation or MongoDB Atlas)  

### Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/kannan-innovates/Student-Management.git


2. Navigate to the project directory:
```bash
cd Student-Management

3.	Install dependencies:
```bash
npm install

4.	Set up environment variables:

Create a file named .env in the root of the project and add the following:

# .env
# Your MongoDB connection string
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/yourDatabaseName?retryWrites=true&w=majority
# The port the server will run on
PORT=5000

5.	Run the application:

For development (with hot-reloading):
```bash
npm run dev

The server will start on http://localhost:5000.

For production:

```bash
npm run build
npm start

🏛️ Architectural Concepts Demonstrated
	•	Request and Response Models
DTOs like CreateStudentDTO and UpdateStudentDTO (in src/types) define clear data contracts for API requests.
Mongoose models (in src/models) define the shape of the data returned from the database.
	•	Dependency Injection
The dependency flow is as follows:

Repository → Service → Controller

	•	StudentController depends on StudentService
	•	StudentService depends on StudentRepository
This makes the code more modular, testable, and maintainable.

	•	Asynchronous Operations
All database interactions and API request handlers are implemented using async/await.
This ensures that the Node.js event loop is never blocked, leading to a highly performant and scalable application.
Proper error handling is implemented using try…catch blocks within async functions.

⸻
