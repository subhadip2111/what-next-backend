import BlogModel from "../Models/BlogModels.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

export async function createBlog(req, res) {
    try {
        // Destructure request body for clarity (assuming required fields)
        const { title, description, tags, author, content } = req.body;

        // Validate required fields (optional, replace with your validation logic)
        if (!title || !description || !tags || !author || !content) {
            return res.status(400).json({ error: 'Missing required fields in request body' });
        }

        const imageUrl = await uploadImageToCloudinary(req.file.path, "BlogImages"); 

        const newBlog = new BlogModel({ image: imageUrl, title, description, tags, author, content });

        // Save the new blog post to the database
        const savedBlog = await newBlog.save();

        // Send the saved blog post data in the response
      return  res.status(201).json({ data: savedBlog }); // 201 Created status code
    } catch (error) {
        console.error(error);

     
        return res.status(500).json({ error: 'Error creating blog post' }); // Generic error for client
    }
}


export const getBlogById=async(req,res)=>{
    try {
        
        const blogId=req.params.blogId
        if(!blogId){
            return res.status(400).json({error:"blogId is required"})
        }
        const blog=await BlogModel.findById({_id:blogId})
        if(!blog){
            return res.status(404).json({error:"blog not found"})
        }
        return res.status(200).json({data:blog})
    } catch (error) {
        
    }
}