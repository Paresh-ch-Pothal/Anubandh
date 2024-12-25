const mongoose = require("mongoose");

const FeedSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model
        required: true
    },
    category: {
        type: String // news, achievement, update
    },
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College",
        required: true
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments:[
        {
            user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
            text:{type: String, required: true},
            createdAt: {type: Date, default: Date.now}
        }
    ],
    
},{
    timestamps: true
});

const Feed = mongoose.model("Feed", FeedSchema);
module.exports = Feed;
