const express = require("express");
const User = require("../models/user");
const Message = require("../models/message");
const Chat = require("../models/chat");
const fetchuser = require("../middleware/fetchuser");
const app = express();
const router = express.Router();
const moment = require("moment");


//...send Message ...//
router.post("/sendmessage", fetchuser, async (req, res) => {
    const { content, chatId, image } = req.body;
    if (!chatId) {
        return res.status(200).json({ success: false, message: "Please provide all the parameters" })
    }
    var newMessage = {
        sender: req.user.id,
        content: content || "",
        chatId: chatId,
        image: image || null,
    };
    try {
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chatId");
        message = await User.populate(message, {
            path: "chatId.users",
            select: "name pic email"
        })
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })
        res.status(200).json({ success: true, message })
    } catch (error) {
        return res.status(500).send("Some internal Error might be occured")
    }
})


//...to fetch all the messages...//
router.get("/fetchmessage/:id", fetchuser, async (req, res) => {
    try {
        const chatId = req.params.id
        const messages = await Message.find({ chatId: chatId }).populate("sender", "name pic email").populate("chatId");
        return res.status(200).send({ success: true, messages });
    } catch (error) {
        console.log(error)
        return res.status(500).send("Some internal issue may be occured");
    }
})


//... delete message by id ...//
router.delete("/deletemessage/:id", fetchuser, async (req, res) => {
    const userId = req.user.id;
    const messageId = req.params.id;

    if (!messageId) {
        return res.status(400).send("Message ID not provided");
    }

    try {
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).send("Message not found");
        }

        if (message.sender._id.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const chatId = message.chatId;
        if (!chatId) {
            return res.status(400).send("Chat ID not present in message");
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).send("No chat is present");
        }

        await Message.findByIdAndDelete(messageId);

        if (chat.latestMessage && chat.latestMessage.toString() === messageId.toString()) {

            const newLatestMessage = await Message.findOne({ chatId: chatId }).sort({ createdAt: -1 });
            chat.latestMessage = newLatestMessage ? newLatestMessage._id : null;
            await chat.save();
        }

        return res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
});

//.. edit a particular message ..//
router.put("/editmessage/:id", fetchuser, async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id;
    const messageId = req.params.id;
    if (!messageId) {
        return res.status(200).send("MessageId is not given");
    }
    try {
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).send("Message not found");
        }

        if (message.sender._id.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }
        const chatId = message.chatId;
        if (!chatId) {
            return res.status(400).send("Chat ID not present in message");
        }
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).send("No chat is present");
        }
        message.content=content
        await message.save();
        if (chat.latestMessage && chat.latestMessage.toString() === messageId.toString()) {
            chat.latestMessage = message._id;
            await chat.save();
        }
        return res.status(200).json({success: true,message: "Message Updated Successfully"});

    } catch (error) {
        return res.status(500).send("Some internal issue is there");
    }
})

module.exports = router