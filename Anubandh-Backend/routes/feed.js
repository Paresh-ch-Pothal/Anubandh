const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Feed = require("../models/feed");

router.post("/createFeed", fetchuser, async (req, res) => {
    try {
        const userId = req.user._id;
        const { title, content, image, category } = req.body;
        if (!title || !content || !category) {
            return res.status(400).json({ message: "Please fill all the fields", success: false });
        }
        const feed = await Feed.create({
            title, content, image, category,
            postedBy: req.user._id,
            college: req.user.collegeId,
        })
        return res.status(200).json({ success: true, feed })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
})


// deleting the post
router.delete("/deleteFeed/:id", fetchuser, async (req, res) => {
    try {
        const feedId = req.params.id
        const feed = await Feed.findById(feedId);
        if (req.user._id !== feed.postedBy.toString() || feed.college.toString() !== req.user.collegeId.toString()) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
        await Feed.findByIdAndDelete(feedId);
        return res.status(200).json({ message: "Post Deleted", success: true });
    } catch (error) {

    }
})

//adding like to the post
router.post("/addlike/:id", fetchuser, async (req, res) => {
    try {
        const feedId = req.params.id;
        const userId = req.user._id;
        const feed = await Feed.findById(feedId);
        if (!feed) { return res.status(404).json({ message: "Feed Not Found", success: false }); }
        const alreadyUser = feed.likes.find((ele) => ele.toString() == userId);
        if (alreadyUser) {
            feed.likes = feed.likes.filter((ele) => ele.toString() !== userId);
            await feed.save();
            return res.status(200).json({ success: true,  feed });
        }
        else {
            feed.likes.push(userId);
            await feed.save();
            return res.status(200).json({ success: true, feed })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false,message: "Some internal issue may be there"})
    }
})

//adding comment to the post
router.post("/addComment/:id",fetchuser,async(req,res)=>{
    try {
        const feedId=req.params.id
        const userId=req.user._id
        const {text}=req.body;
        const feed=await Feed.findById(feedId);
        if(!feed){
            return res.status(401).json({message: "No feed is found",success: false})
        }
        feed.comments.push({user:userId,text:text});
        await feed.save();
        return res.status(200).json({success: true,feed});
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false,message: "Some internal issue may be there"})
    }
})

// populating the feed
router.get("/populateFeed",fetchuser,async(req,res)=>{
    try {
        const user=req.user._id
        const collegeId=req.user.collegeId;
        const feed=await Feed.find({college: collegeId});
        return res.status(200).json({success: true,feed});
    } catch (error) {
        
    }
})

//populate the comment for each feed
router.get("/populateComment/:id",async(req,res)=>{
    try {
        const feedId=req.params.id;
        const feed=await Feed.findById(feedId).populate({
            path: 'comments.user',
            select: 'name email'
        });;
        const comments=feed.comments;
        return res.status(200).json({success: true,comments});

    } catch (error) {
        
    }
})

module.exports = router;
