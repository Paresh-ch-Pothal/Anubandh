const express=require("express");
const router=express.Router()
const fetchcollege=require("../middleware/fetchcollege");
const Event = require("../models/event");

//creating a events
router.post("/createEvent",fetchcollege,async(req,res)=>{
    try {
        const collegeId=req.college.id
        const {title,description,eventDate,location,college,participants,image}=req.body;
        if (!title || !description || !eventDate || !image){
            return res.status(400).json({success: false,message: "Please provide all the necessary Details"});
        }
        const event=await Event.create({
            title,description,eventDate,location,college:collegeId,participants,image
        })
        return res.status(200).json({success: true,event})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false,message: "Some internal issus is there"})
    }
})

module.exports=router