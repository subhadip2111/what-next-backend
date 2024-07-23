import mongoose from 'mongoose';

const ExamPreparationSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exams',
    required: true,
  },
  examName: {
    type: String,
    required: true,
  },
  fees: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  className: {
    type: String,
    default: '',
  },
  schedule: [{
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    }
  }],
});

const TeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  mobile: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    required: false,  
  },
  examPreparation: [ExamPreparationSchema],
}, {
  timestamps: true,
});

const TeacherModel = mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);
export default TeacherModel;
