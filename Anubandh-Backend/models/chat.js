const mongoose=require("mongoose");
const chatSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    IsDomainSpecific:{
        type: Boolean,
        required: true
    },
    isBatchChat: {
        type: Boolean,
        required: true
    },
    participants: [
        {type: mongoose.Schema.Types.ObjectId,ref: "User"}
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true
})

const Chat=mongoose.model("Chat",chatSchema);
module.exports = Chat;