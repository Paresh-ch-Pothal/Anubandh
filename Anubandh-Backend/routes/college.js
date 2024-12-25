const express = require("express");
const College = require("../models/college");
const fetchuser = require("../middleware/fetchuser");
const User = require("../models/user");
const router = express.Router();

router.get("/allRegisteredColleges", async (req, res) => {
    try {
        const college = await College.find();
        return res.status(200).json({ success: true, college });
    } catch (error) {

    }
})

router.put("/updateTheStudentDatabase", fetchuser, async (req, res) => {
    try {
        const collegeId = req.user.collegeId;
        const college = await College.findById(collegeId);
        const userId = req.user._id;
        const user = await User.findById(userId);
        const isUserAlreadyAdded = college.studentDatabase.some(
            (entry) => entry.student.toString() === userId.toString()
        );
        if (isUserAlreadyAdded) {
            return res.status(400).json({ success: false, message: "User is already in the student database" });
        }
        college.studentDatabase.push({ student: userId });
        await college.save();
        return res.status(200).json({ success: true, college });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})

router.put("/addStudentToAuthenticate", async (req, res) => {
    try {
        const {email,collegeId}=req.body;
        const college=await College.findById(collegeId);
        college.studentAutheticate.push({email:email});
        await college.save();
        return res.status(200).json({success:true,college});
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})

module.exports = router;