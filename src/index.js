import express from 'express';
import mongoose from 'mongoose';
import router from "./Routes/routes.js";
import multer from "multer";
import cors from "cors"

import dotenv from 'dotenv'; // Assuming you're using environment variables
dotenv.config(); // Load environment variables
import rateLimit from 'express-rate-limit';
import requestIp  from "request-ip"
const app = express();
app.use(cors())
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
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 80, // Limit each IP to 5 requests per `window` (here, per minute)
  handler: function (req, res, /*next*/) {
    return res.status(429).json({
      error: 'You sent too many requests. Please wait a while then try again'
    })
}
});

// Apply rate limiting to all requests
app.use(limiter);
app.use(express.json());

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
