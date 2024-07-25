
import StudentModel from "../Models/StudentModel.js";
import TeacherModel from "../Models/TeachersModel.js";
import bcrypt from "bcrypt"
import dotenv from 'dotenv'; // Assuming you're using environment variables
dotenv.config(); // Load environment variables
import jwt from "jsonwebtoken"

export const studentRegister = async (req, res) => {
    try {
      const { name, email, password } = req.body;


      // Check if all required fields are provided
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Check if student already exists
      const existingStudent = await StudentModel.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ message: "Student already registered" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create and save the new student
      const student = new StudentModel({
        name,
        email,
        password: hashedPassword
      });
      await student.save();
  
      return res.status(201).json({ message: "Registration successful", student });
  
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({ message: "An error occurred during registration." });
    }
  };





  export const studentLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if all required fields are provided
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      // Find the student by email
      const student = await StudentModel.findOne({ email });
      if (!student) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ id: student._id, email: student.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
      // Respond with success and token
      return res.status(200).json({
        message: "Login successful",
        token,
        student: {
          id: student._id,
          name: student.name,
          email: student.email
        }
      });
  
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: "An error occurred during login." });
    }
  };


