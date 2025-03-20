const mongoose = require("mongoose");
const Category=require("../Controller/category.controller.js")
module.exports ={
    createCategory:async(req,res)=>{
        try{
            const category=new Category(req.body)
            await category.save()
            res.status(201).json({message:"Category created successfully",category})
        }catch(error){
            res.status(400).json({message:error.message})
        }
    }
    
}