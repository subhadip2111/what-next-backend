import express from 'express';
import mongoose from 'mongoose';
import router from "./Routes/routes.js";
import multer from "multer";
import dotenv from 'dotenv'; // Assuming you're using environment variables
dotenv.config(); // Load environment variables

const app = express();

// Improved error handling (remove if you don't need both)
// app.use(bodyParser.urlencoded({ extended: true }));

// Consider using multer.formParser() if you need both form data and file uploads
// app.use(multer.formParser()); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Change 'uploads/' to your desired upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

// Connect to MongoDB (handle connection errors gracefully)
mongoose.connect(process.env.BACKEND_MONGODBCONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true, // Add `useUnifiedTopology` for newer Mongoose versions
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
});



 app.use("/", router);

// Specific middleware for file upload route
app.post('/upload', upload.single('myFile'), (req, res) => {
  // Handle file upload logic here
});

// Listen on the specified port (handle potential errors)
app.listen(process.env.PORT, () => {
  console.log(`Express server listening on port ${process.env.PORT}`);
})
.on('error', (err) => {
  console.error('Express server error:', err);
  // process.exit(1); // Exit on server errors
});
