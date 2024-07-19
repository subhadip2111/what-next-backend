import express from 'express';
import multer from 'multer';
import cloudinary from "cloudinary";
import dotenv from 'dotenv'; // Assuming you're using environment variables
dotenv.config(); // Load environment variables
import {createBlog, getBlogById} from "../Controller/BlogController.js"
import { getAllExams, getExamById } from '../Controller/ExamController.js';
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


//exam
router.get('/api/exam',getAllExams)
router.get('/api/exams/:examId',getExamById)

export default router;