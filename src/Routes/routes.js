import express from 'express';
import multer from 'multer';
import cloudinary from "cloudinary";
import dotenv from 'dotenv'; // Assuming you're using environment variables
dotenv.config(); // Load environment variables
import {createBlog, getAllBlogs, getBlogById} from "../Controller/BlogController.js"
import { getAllExams, getExamById } from '../Controller/ExamController.js';
import { addTeacher, findTeacherByQuery, teacherProfileDetails } from '../Controller/TeacherController.js';
import { studentLogin, studentRegister } from '../Controller/authCotroller.js';
// Configure Multer for single file uploads with field name 'image'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Replace with your desired temporary storage location
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});
const upload = multer({ storage });


const router = express.Router();

router.post('/api/blog', upload.single('image'), createBlog);
router.get('/api/blog/:blogId',getBlogById)
router.get('/api/blog',getAllBlogs)

//exam
router.get('/api/exam',getAllExams)
router.get('/api/exams/:examId',getExamById)

// Teachers routes
router.post('/api/create/teacher',addTeacher)
router.get('/api/teachers/query',findTeacherByQuery)
router.get('/api/teacher/profileDetails/:teacherId',teacherProfileDetails)

// Student Routes
router.post('/api/student/registration',studentRegister)
router.post('/api/login/student',studentLogin)
export default router;