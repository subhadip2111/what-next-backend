import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: false,
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
      required: false,
    },
password:{
    type:String,
    required: true,
}
 
  }, {
    timestamps: true,
  });
  
  export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
  