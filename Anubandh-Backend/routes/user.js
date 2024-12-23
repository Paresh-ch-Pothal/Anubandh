const express = require("express");
const User = require("../models/user");
const College = require("../models/college");
const app = express();
const router = express.Router();
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "^@12@34#%^&8@1%6$5^&#1234";


//... Signup ...//
// router.post("/signup", async (req, res) => {
//     const { name, email, password, batch, domain, pic } = req.body;
//     if (!name || !email || !password || !batch || !domain) {
//         return res.status(200).json({ success: false, message: "please provide all the required details" })
//     }
//     const userExist = await User.findOne({ email });
//     if (userExist) {
//         return res.status(200).json({ success: false, message: "Someone alerady exist with the same email" });
//     }
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
//         const user = await User.create({
//             name, email, password: hashedPassword, batch, domain, pic
//         })
//         const payload = {
//             user: {
//                 _id: user._id,
//                 name: user.name
//             }
//         }
//         const authtoken = JWT.sign(payload, JWT_SECRET);
//         return res.status(200).json({ success: true, user, authtoken })
//     } catch (error) {
//         return res.status(500).send("Some internal issue is there")
//     }
// })


//...FetchAllUser...//
router.get("/fetchalluser", fetchuser, async (req, res) => {
    try {
        const userId = req.user._id;
        const users = await User.find({ _id: { $ne: userId } }).select("-password");
        return res.status(200).json({ success: true, users })
    } catch (error) {
        return res.status(500).send("Some internal issue is there")
    }
})


//...searchUser...//
router.get("/searchuser", fetchuser, async (req, res) => {
    const search = req.query.search;
    const userId = req.user._id
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
// router.post("/signin", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ success: false, error: "Invalid Credentials" });
//         }
//         const compaarePassword = await bcrypt.compare(password, user.password);
//         if (!compaarePassword) {
//             return res.status(400).json({ success: false, error: "Please try with correct information" })
//         }

//         const payload = {
//             user: {
//                 _id: user._id,
//                 name: user.name
//             }
//         }

//         const authtoken = JWT.sign(payload, JWT_SECRET);
//         return res.json({ success: true, authtoken })
//     } catch (error) {
//         return res.status(500).send("Some internal issue is there")
//     }
// })


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


// Signup Route
// router.post("/signup", async (req, res) => {
//     const {
//         name,
//         email,
//         password,
//         role,
//         college,
//         batch,
//         address,
//         state,
//         pincode,
//         domain,

//     } = req.body;

//     try {
//         // Validation
//         if (!email || !password || !name || !role) {
//             return res
//                 .status(400)
//                 .json({ success: false, error: "Please provide all required fields." });
//         }

//         if (role === "college") {
//             // College Signup
//             let existingCollege = await College.findOne({ email });
//             if (existingCollege) {
//                 return res.status(400).json({
//                     success: false,
//                     error: "Email already registered as a college.",
//                 });
//             }

//             const hashedPassword = await bcrypt.hash(password, 10);
//             const newCollege = await College.create({
//                 name,
//                 address,
//                 state,
//                 pincode,
//                 email,
//                 adminPassword: hashedPassword,
//             });

//             const payload = {
//                 user: { _id: newCollege._id, name: newCollege.name },
//             };
//             const authtoken = JWT.sign(payload, JWT_SECRET);

//             return res.status(201).json({
//                 success: true,
//                 user: {
//                     id: newCollege._id,
//                     name: newCollege.name,
//                     email: newCollege.email,
//                 },
//                 authtoken,
//             });
//         } else if (role === "alumni") {
//             // Student or Alumni Signup
//             let existingUser = await User.findOne({ email });
//             if (existingUser) {
//                 return res
//                     .status(400)
//                     .json({ success: false, error: "Email already registered." });
//             }

//             const userCollege = await College.findOne({ name: college });
//             if (!userCollege) {
//                 return res
//                     .status(404)
//                     .json({ success: false, error: "College not found." });
//             }

//             const hashedPassword = await bcrypt.hash(password, 10);
//             const newUser = await User.create({
//                 name,
//                 email,
//                 password: hashedPassword,
//                 college: userCollege._id,
//                 batch,
//             });

//             const payload = {
//                 user: {
//                     _id: newUser._id,
//                     name: newUser.name,
//                     collegeId: userCollege._id,
//                 },
//             };
//             const authtoken = JWT.sign(payload, JWT_SECRET);

//             return res.status(201).json({
//                 success: true,
//                 user: {
//                     id: newUser._id,
//                     name: newUser.name,
//                     email: newUser.email,
//                     collegeId: userCollege._id,
//                 },
//                 authtoken,
//             });
//         }
//     } catch (error) {
//         console.error(error.message);
//         return res
//             .status(500)
//             .json({ success: false, error: "Internal Server Error" });
//     }
// });


// router.post("/signup", async (req, res) => {
//     const {
//         name,
//         email,
//         password,
//         role,
//         college,
//         batch,
//         address,
//         state,
//         pincode,
//         domain,
//         currentEmployer,
//         skills,
//         pic
//     } = req.body;

//     try {
//         // Validation
//         if (!email || !password || !name || !role) {
//             return res
//                 .status(400)
//                 .json({ success: false, error: "Please provide all required fields." });
//         }

//         if (role === "college") {
//             // College Signup
//             let existingCollege = await College.findOne({ email });
//             if (existingCollege) {
//                 return res.status(400).json({
//                     success: false,
//                     error: "Email already registered as a college.",
//                 });
//             }

//             const hashedPassword = await bcrypt.hash(password, 10);
//             const newCollege = await College.create({
//                 name,
//                 address,
//                 state,
//                 pincode,
//                 email,
//                 adminPassword: hashedPassword,
//             });

//             const payload = {
//                 user: { _id: newCollege._id, name: newCollege.name },
//             };
//             const authtoken = JWT.sign(payload, JWT_SECRET);

//             return res.status(201).json({
//                 success: true,
//                 user: {
//                     id: newCollege._id,
//                     name: newCollege.name,
//                     email: newCollege.email,
//                 },
//                 authtoken,
//             });
//         } else if (role === "alumni" || role === "student") {
//             // Alumni or Student Signup
//             let existingUser = await User.findOne({ email });
//             if (existingUser) {
//                 return res
//                     .status(400)
//                     .json({ success: false, error: "Email already registered." });
//             }

//             const userCollege = await College.findOne({ name: college });
//             if (!userCollege) {
//                 return res
//                     .status(404)
//                     .json({ success: false, error: "College not found." });
//             }

//             const hashedPassword = await bcrypt.hash(password, 10);
//             const newUser = await User.create({
//                 name,
//                 email,
//                 password: hashedPassword,
//                 aadharNumber,
//                 college: userCollege._id,
//                 batch,
//                 pic: pic,
//                 currentEmployer: role === "alumni" ? currentEmployer : undefined,
//                 skills,
//                 domain,
//             });

//             const payload = {
//                 user: {
//                     _id: newUser._id,
//                     name: newUser.name,
//                     collegeId: userCollege._id,
//                 },
//             };
//             const authtoken = JWT.sign(payload, JWT_SECRET);

//             return res.status(201).json({
//                 success: true,
//                 user: {
//                     _id: newUser._id,
//                     name: newUser.name,
//                     email: newUser.email,
//                     collegeId: userCollege._id,
//                 },
//                 authtoken,
//             });
//         } else {
//             return res.status(400).json({ success: false, error: "Invalid role specified." });
//         }
//     } catch (error) {
//         console.error(error.message);
//         return res
//             .status(500)
//             .json({ success: false, error: "Internal Server Error" });
//     }
// });


// Login Route
// router.post("/signin", async (req, res) => {
//     const { email, password, role } = req.body;

//     try {
//         if (!email || !password || !role) {
//             return res.status(400).json({
//                 success: false,
//                 error: "Please provide email, password, and role.",
//             });
//         }

//         if (role === "college") {
//             // College Login
//             let user = await College.findOne({ email });
//             if (!user) {
//                 return res.status(401).json({
//                     success: false,
//                     error: "Invalid email or not registered as a college.",
//                 });
//             }

//             const isPasswordMatch = await bcrypt.compare(
//                 password,
//                 user.adminPassword
//             );
//             if (!isPasswordMatch) {
//                 return res
//                     .status(402)
//                     .json({ success: false, error: "Invalid password." });
//             }
//             const payload = { user: { id: user._id, name: user.name } };
//             const authtoken = JWT.sign(payload, JWT_SECRET);

//             return res.status(200).json({ success: true, authtoken });
//         } else if (role === "alumni") {
//             // Student or Alumni Login
//             let user = await User.findOne({ email });
//             if (!user) {
//                 return res.status(401).json({
//                     success: false,
//                     error: "Invalid email or not registered as a user.",
//                 });
//             }

//             const isPasswordMatch = await bcrypt.compare(password, user.password);
//             if (!isPasswordMatch) {
//                 return res
//                     .status(402)
//                     .json({ success: false, error: "Invalid password." });
//             }
//             const payload = {
//                 user: { _id: user._id, name: user.name, collegeId: user.college._id },
//             };
//             const authtoken = JWT.sign(payload, JWT_SECRET);
//             return res.status(200).json({ success: true, authtoken });
//         }
//     } catch (error) {
//         console.error(error.message);
//         return res
//             .status(500)
//             .json({ success: false, error: "Internal Server Error" });
//     }
// });


// signup Routes
router.post("/signup",async(req,res)=>{
    try {
        const {
            role,name,email,password,college,batch,address,state,pincode,domain,currentEmployer,skills,pic
        }=req.body;
        if(!email || !password || !name || ! role){
            return res.status(400).json({success: false,message:"Please provide all the detailes"});
        }
        if(role == "college"){
            const ExistingCollege=await College.findOne({email});
            if(ExistingCollege){
                return res.status(400).json({success: false,message:"Email already registered as a college"});  
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            const newCollege=await College.create({
                name,address,state,pincode,email,adminPassword: hashedPassword
            })
            const payload={
                college:{
                    _id: newCollege._id,
                    name: newCollege.name
                }
            }
            const authtoken=JWT.sign(payload,JWT_SECRET);
            return res.status(200).json({success: true,newCollege,authtoken});
        }
        else if(role == "alumni" || role == "student"){
            let existUser=await User.findOne({email});
            if(existUser){
                return res.status(400).json({success: false,message:"Email already registered"});
            }
            const userCollege=await College.findOne({name:college});
            if(!userCollege){
                return res.status(404).json({success: false,message:"College not found"});
            }
            let userfind;
            userCollege.studentAutheticate.forEach(ele => {
                if(ele.email == email){
                    userfind=true
                }
            });
            if(!userfind){
                return res.status(400).json({success: false,message: "You are not authenticated by college"});
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            const newUser=await User.create({
                name,email,password:hashedPassword,college:userCollege._id,batch,pic,currentEmployer,skills,domain
            })
            const payload={
                user:{
                    _id:newUser._id,
                    name:newUser.name,
                    collegeId: userCollege._id
                }
            }
            const authtoken=JWT.sign(payload,JWT_SECRET);
            return res.status(200).json({success: true,newUser,authtoken});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false,message:"Some internal issue is there"});
    }
})

// signin routes
router.post("/signin",async(req,res)=>{
    try {
        const {email,password,role}=req.body;
        if(!email || !password || !role){
            return res.status(400).json({success: false,message:"Please provide email, password and role"});
        }
        if(role == "college"){
            const college=await College.findOne({email: email});
            if(!college){
                return res.status(404).json({success: false,message:"Invalid email or not registered as a college"});
            }
            const isPasswordMatch=await bcrypt.compare(password,college.adminPassword);
            if(!isPasswordMatch){
                return res.status(400).json({success: false,message:"Invalid password"});
            }
            const payload={
                college:{
                    _id: college._id,
                    name: college.name
                }
            }
            const authtoken=JWT.sign(payload,JWT_SECRET);
            return res.status(200).json({success: true,college,authtoken});
        }
        else if(role == "alumni" || role == "student"){
            const user=await User.findOne({email: email});
            if(!user){
                return res.status(404).json({success: false,message:"Invalid email or not registered as a user"});
            }
            const isPasswordMatch=await bcrypt.compare(password,user.password);
            if(!isPasswordMatch){
                return res.status(400).json({success: false,message:"Invalid password"});
            }
            const payload={
                user:{
                    _id:user._id,
                    name:user.name,
                    collegeId: user.college._id
                }
            }
            const authtoken=JWT.sign(payload,JWT_SECRET);
            return res.status(200).json({success: true,user,authtoken});
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false,message:"Some internal issue is there"});
    }
})



module.exports = router