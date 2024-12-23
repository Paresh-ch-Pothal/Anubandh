// const mongoose=require("mongoose")
// const userSchema=new mongoose.Schema({
//     name:{
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password:{
//         type: String,
//         required: true
//     },
//     batch:{
//         type: String,
//         required: true
//     },
//     pic: {
//         type: String,
//         required: true
//     },
//     domain:[
//         {type: String,required: true}
//     ],
//     chats:[
//         {type: mongoose.Schema.Types.ObjectId,ref:"Chat"}
//     ]
// },{
//     timestamps: true
// })

// const User=mongoose.model("User",userSchema);
// module.exports=User;

const mongoose = require("mongoose");
const College = require("./college");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College",
        required: true,
    },
    batch: {
        type: String,
        required: true,
    },
    pic: {
        type: String,
    },
    currentEmployer: {
        type: String, // For alumni
    },
    skills: {
        type: [String],
    },
    domain: [
        { type: String, required: true }
    ],
    chats: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }
    ],
},{
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;