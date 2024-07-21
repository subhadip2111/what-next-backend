// models/teacher.js
import mongoose from 'mongoose';

const ExamPreparationSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exams',
    required: true,
  },
  fees: {
    type: String,
    required: true,
  },
});

const TeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contactInfo: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    required: true,
  },
  examPreparation: [ExamPreparationSchema],
}, {
  timestamps: true,
});

const TeacherModel= mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);
export default TeacherModel

 