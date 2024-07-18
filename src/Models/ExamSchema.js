const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OpportunitySchema = new Schema({
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  benefits: {
    type: String,
    required: false
  }
});

const ExamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  lastDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  eligibility: {
    type: String,
    required: true
  },
  subjects: {
    type: [String],
    required: true
  },
  format: {
    type: String,
    required: true
  },
  syllabus: {
    type: String,
    required: true
  },
  syllabusLink: {
    type: String,
    required: true
  },
  duration:{
    type: String,
    required: true

  },
  officialWebsite: {
    type: String,
    required: true
  },
  importantNotes: {
    type: String,
    required: false
  },
  opportunities: {
    type: [OpportunitySchema],
    required: false
  },
  description: {
    type: String,
    required: true
  },    
  importantDates: {
    type: String,
    required: true
  },
  stream:{
    type: String,
  },
  degree: {
    type: [String], // e.g., UG, PG, 12, etc.
    required: true
  },
  type: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Define ExamModel only once
const ExamModel = mongoose.models.Exams || mongoose.model('Exams', ExamSchema);

export default ExamModel;
