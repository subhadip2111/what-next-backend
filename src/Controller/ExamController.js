import ExamModel from "../Models/ExamModels.js";

// Function to handle fetching exams
export async function getAllExams(req, res) {
  const {
    keyword = "",
    limit = 10,
    offset = 0,
    subjects = [],
    degree = [],
    level = [],
  } = req.query;

  try {
    let query = {};

    // Build query dynamically based on provided parameters
    if (keyword) {
      query = {
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { eligibility: { $regex: keyword, $options: "i" } },
          { level: { $regex: keyword, $options: "i" } },
          {
            degree: {
              $in: keyword.split(" ").map((deg) => new RegExp(deg, "i")),
            },
          }, // Case-insensitive regex search for degree (considering multiple words)
          { stream: { $regex: keyword, $options: "i" } },
          { subjects: { $in: subjects.map((subj) => new RegExp(subj, "i")) } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    // Filter by subjects and degree (if provided)
    if (subjects.length > 0) {
      query.subjects = { $in: subjects.map((subj) => new RegExp(subj, "i")) };
    }
    if (degree.length > 0) {
      query.degree = { $in: degree.map((degr) => new RegExp(degr, "i")) };
    }

    // Filter by level (if provided)
    if (level.length > 0) {
      query.level = { $in: level }; // Assuming level is already an array
    }

    // Fetch exams based on query and pagination
    const exams = await ExamModel.find(query).limit(limit).skip(offset);

    res.json({ success: true, data: exams }); // Use res.json directly for Express response
  } catch (error) { 
    console.error("Error fetching exams:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" }); // Set status code and error message
  }
}

export const getExamById = async (req, res) => {
  const examId = req.params.examId;
  if (!examId) {
    return res.status(400).json({ msg: "please give the ExamId" });
  }
  const exam = await ExamModel.findById({ _id: examId });
  if (!exam) {
    return res.status(404).json({ msg: "Exam not found" });
  }
  return res.status(200).json({ data: exam });
};
