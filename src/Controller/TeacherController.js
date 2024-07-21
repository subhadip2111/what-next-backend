import ExamModel from "../Models/ExamModels.js";
import TeacherModel from "../Models/TeachersModel.js";



export const addTeacher = async (req, res) => {
    try {
      let { name, contactInfo, mobile, address, profilePic, examPreparation } = await req.body;
      console.log(name);

     // Validate required fields
      if (!name || !contactInfo || !mobile || !address || !profilePic || !examPreparation) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Create a new teacher document
      const newTeacher = new TeacherModel({
        name,
        contactInfo,
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
      const { location, examName, className, keyword, limit = 10, offset = 0 } = req.query;
  
      // Convert limit and offset to numbers
      const limitNumber = parseInt(limit, 10);
      const offsetNumber = parseInt(offset, 10);
  
      // Build the filter criteria
      let query = {};
      if (location) {
        query['address'] = { $regex: location, $options: 'i' }; // Case-insensitive regex for location
      }
  
      // Find exam IDs by examName
      let examIds = [];
      if (examName) {
        const exams = await ExamModel.find({ name: { $regex: examName, $options: 'i' } }).select('_id');
        examIds = exams.map(exam => exam._id);
      }
  
      // Add examName filter if provided
      if (examIds.length > 0) {
        query['examPreparation.exam'] = { $in: examIds };
      }
  
      // Add className filter if provided
      if (className) {
        query['examPreparation.className'] = { $regex: className, $options: 'i' };
      }
  
      // Add keyword search if provided
      if (keyword) {
        query['examPreparation.exam'] = { $search: keyword };
      }
  
  
      // Find teachers with pagination and population
      const teachers = await TeacherModel.find(query)
        .populate('examPreparation.exam', 'name') 
        .skip(offsetNumber)
        .limit(limitNumber)
        .exec();
  
      // Debugging log
      
      res.json(teachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      res.status(500).json({ message: "An error occurred while fetching teachers." });
    }
  };