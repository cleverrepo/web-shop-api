const cookie=require('cookie-parser');
const jwt  = require("jsonwebtoken");
const generateToken=(res,userId)=>{
const token=jwt.sign({userId}, process.env.JWT_SECRETESS_KEY,{expiresIn:"1h"})
res.cookie("token",token,{
    httpOnly:true,
    secure:process.env.DEV_STATUS==="production",
    sameSite:'strict',
    maxAge:7*24*60  *1000 
});
return token; 
}

module.exports=generateToken;