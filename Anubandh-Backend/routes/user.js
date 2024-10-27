const express = require("express");
const User = require("../models/user");
const app = express();
const router = express.Router();
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "^@12@34#%^&8@1%6$5^&#1234";


//... Signup ...//
router.post("/signup", async (req, res) => {
    const { name, email, password, batch, domain, pic } = req.body;
    if (!name || !email || !password || !batch || !domain) {
        return res.status(200).json({ success: false, message: "please provide all the required details" })
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(200).json({ success: false, message: "Someone alerady exist with the same email" });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            name, email, password: hashedPassword, batch, domain, pic
        })
        const payload = {
            user: {
                _id: user._id,
                name: user.name
            }
        }
        const authtoken = JWT.sign(payload, JWT_SECRET);
        return res.status(200).json({ success: true, user, authtoken })
    } catch (error) {
        return res.status(500).send("Some internal issue is there")
    }
})


//...FetchAllUser...//
router.get("/fetchalluser",fetchuser, async (req, res) => {
    try {
        const userId=req.user._id;
        const users = await User.find({ _id: { $ne: userId } }).select("-password");
        return res.status(200).json({ success: true, users })
    } catch (error) {
        return res.status(500).send("Some internal issue is there")
    }
})


//...searchUser...//
router.get("/searchuser",fetchuser, async (req, res) => {
    const search = req.query.search;
    const userId=req.user._id
    try {
        if (!search) {
            return res.status(200).json({ success: true, message: "No Search item is present" });
        }
        const users = await User.find({
            $and: [
                { _id: { $ne: userId } },  
                { $or: [{ name: { $regex: search, $options: "i" } }] }  
            ]
        }).select("-password"); 
        
        if (users.length == 0) {
            return res.status(200).json({ success: false, message: "No User is present" });
        }
        return res.status(200).json({ success: true, users })
    } catch (error) {
        return res.status(500).send("Some internal issue is there")
    }
})


// ... get then user by id ...//
router.get("/getuser/:id", async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId).select("-password");
        return res.status(200).json(user);
    } catch (error) {
        console.log(error)
        return res.status(500).send("Some error has been occured");
    }
})


//...signin...//
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: "Invalid Credentials" });
        }
        const compaarePassword = await bcrypt.compare(password, user.password);
        if (!compaarePassword) {
            return res.status(400).json({ success: false, error: "Please try with correct information" })
        }

        const payload = {
            user: {
                _id: user._id,
                name: user.name
            }
        }

        const authtoken = JWT.sign(payload, JWT_SECRET);
        return res.json({ success: true, authtoken })
    } catch (error) {
        return res.status(500).send("Some internal issue is there")
    }
})


//...profile...//
router.get("/profile", fetchuser, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).send("Some internal issue is present");
    }
})



module.exports = router