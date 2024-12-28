const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Feed = require("../models/feed");
const User = require("../models/user");
const fetchcollege = require("../middleware/fetchcollege");

router.post("/createFeed", fetchuser, async (req, res) => {
    try {
        //post by a user or alumni
        if (req.user.type === "alumni") {
            const userId = req.user.id
            const user = await User.findById(userId);
            const collegeId = user.college
            const { title, content, image, category } = req.body;
            if (!title || !content || !category) {
                return res.status(400).json({ message: "Please fill all the fields", success: false });
            }
            
            const feed = await Feed.create({
                title, content, image, category,
                college: collegeId,
            })
            feed.postedBy.user = req.user.id
            await feed.save();
            return res.status(200).json({ success: true, feed })
        }
        //post by a college
        if (req.user.type === "college") {
            const collegeId = req.user.id
            const { title, content, image, category } = req.body;
            if (!title || !content || !category) {
                return res.status(400).json({ message: "Please fill all the fields", success: false });
            }
            
            const feed = await Feed.create({
                title, content, image, category,
                college: collegeId
            })
            feed.postedBy.college = collegeId
            await feed.save();
            return res.status(200).json({ success: true, feed })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
})


// deleting the post
router.delete("/deleteFeed/:id", fetchuser, async (req, res) => {
    try {
        //deleting the user post : access-> user,college
        if (req.user.type === "alumni") {
            const feedId = req.params.id
            const userId = req.user.id
            const user = await User.findById(userId);
            const collegeId = user.college
            const feed = await Feed.findById(feedId);
            if (req.user.id !== feed.postedBy.user.toString() || feed.college.toString() !== collegeId.toString()) {
                return res.status(401).json({ message: "Unauthorized", success: false });
            }
            await Feed.findByIdAndDelete(feedId);
            return res.status(200).json({ message: "Post Deleted", success: true });
        }
        //deleting the college post
        if (req.user.type === "college") {
            const feedId = req.params.id
            const collegeId = req.user.id
            console.log(collegeId);
            const feed = await Feed.findById(feedId);
            if (collegeId !== feed.college.toString()) {
                return res.status(401).json({ message: "Unauthorized", success: false });
            }
            await Feed.findByIdAndDelete(feedId);
            return res.status(200).json({ message: "Post Deleted", success: true });
        }

    } catch (error) {

    }
})

//adding like to the post
router.post("/addlike/:id", fetchuser, async (req, res) => {
    try {
        //liked by a user
        if (req.user.type === "alumni") {
            const feedId = req.params.id;
            const userId = req.user.id;
            const feed = await Feed.findById(feedId);
            if (!feed) { return res.status(404).json({ message: "Feed Not Found", success: false }); }
            const alreadyUser = feed.likes.users.find((ele) => ele.toString() == userId);
            if (alreadyUser) {
                feed.likes = feed.likes.users.filter((ele) => ele.toString() !== userId);
                await feed.save();
                return res.status(200).json({ success: true, feed });
            }
            else {
                feed.likes.users.push(userId);
                await feed.save();
                return res.status(200).json({ success: true, feed })
            }
        }
        //liked by a college
        if (req.user.type === "college") {
            const feedId = req.params.id;
            const collegeId = req.user.id
            const feed = await Feed.findById(feedId);
            if (!feed) { return res.status(404).json({ message: "Feed Not Found", success: false }); }
            const alreadyCollege = feed.likes.colleges.find((ele) => ele.toString() == collegeId);
            if (alreadyCollege) {
                feed.likes = feed.likes.colleges.filter((ele) => ele.toString() !== collegeId);
                await feed.save();
                return res.status(200).json({ success: true, feed });
            }
            else {
                feed.likes.colleges.push(collegeId);
                await feed.save();
                return res.status(200).json({ success: true, feed })
            }
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Some internal issue may be there" })
    }
})

//adding comment to the post
router.post("/addComment/:id", fetchuser, async (req, res) => {
    try {
        // commented a user to a post
        if (req.user.type === "alumni") {
            const feedId = req.params.id
            const userId = req.user.id
            const { text } = req.body;
            const feed = await Feed.findById(feedId);
            if (!feed) {
                return res.status(401).json({ message: "No feed is found", success: false })
            }
            feed.comments.userComments.push({ user: userId, text: text });
            await feed.save();
            return res.status(200).json({ success: true, feed });
        }
        // commented by a college to a post
        if (req.user.type === "college") {
            const feedId = req.params.id
            const collegeId = req.user.id
            const { text } = req.body;
            const feed = await Feed.findById(feedId);
            if (!feed) {
                return res.status(401).json({ message: "No feed is found", success: false })
            }
            feed.comments.collegeComments.push({ college: collegeId, text: text });
            await feed.save();
            return res.status(200).json({ success: true, feed });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Some internal issue may be there" })
    }
})

// populating the feed
router.get("/populateFeed", fetchuser, async (req, res) => {
    try {
        //if user is present
        if (req.user.type === "alumni") {
            const userId = req.user.id
            const user = await User.findById(userId);
            const collegeId = user.college
            const feed = await Feed.find({ college: collegeId });
            return res.status(200).json({ success: true, feed });
        }
        // if college is present
        if (req.user.type === "college") {
            const feed = await Feed.find({ college: req.user.id });
            return res.status(200).json({ success: true, feed });
        }

    } catch (error) {

    }
})

//populate the comment for each feed
router.get("/populateComment/:id", fetchuser,async (req, res) => {
    try {
        const feedId = req.params.id;
        if (req.user.type === "alumni") {
            const feed = await Feed.findById(feedId).populate({
                path: 'comments.userComments.user',
                select: 'name email'
            });
            const comments = feed.comments;
            return res.status(200).json({ success: true, comments });
        }
        if (req.user.type === "college") {
            const feed = await Feed.findById(feedId).populate({
                path: 'comments.collegeComments.college',
                select: 'name email'
            });
            const comments = feed.comments;
            return res.status(200).json({ success: true, comments });
        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false,message: "Some internal issue may be there"})
    }
})

module.exports = router;
