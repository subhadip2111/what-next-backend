import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({

title:{
    type:String,required:true
},
description:{
    type:String,required:true
},
tags:{
    type:[String],required:true
},
image:{
    type:String,required:true
},

author:{
    type:String,required:true
},
content:{
    type:String,required:true  
}

},{ timestamps: true })
const BlogModel =mongoose.models.Blog|| mongoose.model("Blog", blogSchema);

export default BlogModel    