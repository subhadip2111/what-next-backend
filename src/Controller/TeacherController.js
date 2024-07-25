import ExamModel from "../Models/ExamModels.js";
import TeacherModel from "../Models/TeachersModel.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";



export const addTeacher = async (req, res) => {
    try {
      let { name, email, mobile, address, profilePic, examPreparation } = await req.body;
      console.log(name);

     // Validate required fields
      if (!name || !email || !mobile || !address || !profilePic || !examPreparation) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Create a new teacher document
      const newTeacher = new TeacherModel({
        name,
        email,
        mobile,
        address,
        profilePic,
        examPreparation
      });
  
      // Save the teacher document to the database
      const savedTeacher = await newTeacher.save();
  
      // Respond with the saved teacher data
    return   res.status(201).json(savedTeacher);
    } catch (error) {
      console.error('Error adding teacher:', error);
   return    res.status(500).json({ message: 'Internal server error' });
    }
  };



  //
  export const findTeacherByQuery = async (req, res) => {
    try {
      const { location, examName, className, keyword, limit = 10, offset = 0, priceGt, priceLt } = req.query;
  
      // Convert limit and offset to numbers
      const limitNumber = parseInt(limit, 10);
      const offsetNumber = parseInt(offset, 10);
  
      // Build the filter criteria
      let query = {};
  
      // Filter by location
      if (location) {
        query['address'] = { $regex: location, $options: 'i' };
      }
  
      // Find exam IDs by examName
      let examIds = [];
      if (examName) {
        const exams = await ExamModel.find({ name: { $regex: examName, $options: 'i' } }).select('_id');
        examIds = exams.map(exam => exam._id);
      }
  
      // Add examName filter if provided
      if (examIds.length > 0) {
        query['examPreparation.examId'] = { $in: examIds };
      }
  
      // Add className filter if provided
      if (className) {
        query['examPreparation.className'] = { $regex: className, $options: 'i' };
      }
  
      // Add keyword search if provided
      if (keyword) {
        query['$or'] = [
          { name: { $regex: keyword, $options: 'i' } },
          { address: { $regex: keyword, $options: 'i' } },
          { 'examPreparation.description': { $regex: keyword, $options: 'i' } },
          { 'examPreparation.examName': { $regex: keyword, $options: 'i' } },
          { 'examPreparation.fees': { $regex: keyword , $options: 'i'} }
        ];
      }
  
      // Add price filter if provided
      if (priceGt || priceLt) {
        query['examPreparation.fees'] = {};
        if (priceGt) {
          query['examPreparation.fees']['$gte'] = parseFloat(priceGt);
        }
        if (priceLt) {
          query['examPreparation.fees']['$lte'] = parseFloat(priceLt);
        }
      }
  
      // Find teachers with pagination and population
      const teachers = await TeacherModel.find(query)
        .populate({
          path: 'examPreparation.examId',
          select: 'name'
        })
        .skip(offsetNumber)
        .limit(limitNumber)
        .exec();
  
      return res.status(200).json(teachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return res.status(500).json({ message: "An error occurred while fetching teachers." });
    }
  };

  export const teacherProfileDetails=async (req,res)=>{

    const teachersId=req.params.teacherId
    try {
      const teacher=await TeacherModel.findById(teachersId).populate('examPreparation')
      if(!teacher){
        return res.status(404).json({message:"Teacher not found"})  
      }
      return res.status(200).json(teacher)
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return res.status(500).json({ message: "An error occurred while fetching teachers." });
    }
  }

  export const uploadProfileImage = async (req, res) => {
    try {
      const teacherId = req.params.teacherId;
  // console.log(req.file.path );
      // Check if a file is uploaded
        if (!req.file || !req.file.path) {
          return res.status(400).json({ message: "No file uploaded" });
        }
    
      // Find the teacher by ID
      const teacher = await TeacherModel.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
  
      const imageUrl = await uploadImageToCloudinary(req.file.path, "profilePic");
  console.log(imageUrl);
      teacher.profilePic = imageUrl;
  
      // Save the updated teacher document
      const updatedTeacher = await teacher.save();
  
      // Respond with the updated teacher data
      return res.status(200).json(updatedTeacher);
  
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return res.status(500).json({ message: "An error occurred while uploading the profile image." });
    }
  };