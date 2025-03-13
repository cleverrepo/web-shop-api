const mongoose = require('mongoose')
const userSchema =  mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verification:{
    type: String, 
   
  },
  isVerified:{
    type:Boolean,
    default:false
},
  isAdmin: { type: Boolean, default: false },
  resetPasswordToken:String,
  resetPasswordExpires:Date,
 
  verificationExpires:Date,
// Admin flag
});

const User = mongoose.model('User', userSchema);
module.exports = User;
