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
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College"
        }
    },
    category: {
        type: String // news, achievement, update
    },
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College",
    },
    likes: {
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        colleges: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "College",
            },
        ],
    },
    comments: {
        userComments: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                text: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        collegeComments: [
            {
                college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
                text: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },

}, {
    timestamps: true
});

const Feed = mongoose.model("Feed", FeedSchema);
module.exports = Feed;
