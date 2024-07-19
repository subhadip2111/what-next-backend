import multer from 'multer';

// Configure Multer to store images in memory (for small files)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default upload;