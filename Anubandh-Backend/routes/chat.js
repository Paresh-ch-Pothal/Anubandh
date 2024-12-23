const express = require("express");
const User = require("../models/user");
const Message = require("../models/message");
const Chat = require("../models/chat");
const fetchuser = require("../middleware/fetchuser");
const College = require("../models/college");
const app = express();
const router = express.Router();

router.post("/singlechat", fetchuser, async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(200).json({ success: false, message: "Please provide the userId" })
    }

    var isChat = await Chat.findOne({
        IsDomainSpecific: false,
        isBatchChat: false,
        $and: [
            { participants: { $in: [req.user._id] } },
            { participants: { $in: [userId] } },
        ],
    }).populate("participants", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat) {
        res.send(isChat);
    }
    else {
        var chatData = {
            name: "sender",
            IsDomainSpecific: false,
            isBatchChat: false,
            participants: [req.user._id, userId],
            latestMessage: null
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("participants", "-password")
                .populate("latestMessage");
            res.status(200).json(FullChat)
        } catch (error) {
            return res.status(500).send("Some internal may be occured");
        }
    }
})



//...fetching chats of a particular user...//
router.get("/fetchchats", fetchuser, async (req, res) => {
    try {
        let chats = await Chat.find({
            participants: { $in: [req.user._id] }
        })
            .populate("participants", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });
        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name pic email",
        });
        res.status(200).send(chats);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Some error has occurred");
    }
});


//...creating a group chat based on the domain...//
// router.post("/groupchatbaseddomain", fetchuser, async (req, res) => {
//     const { domains } = req.body;
//     if (!domains || !domains.length) {
//         return res.status(400).send({ success: false, message: "Please provider all the details" })
//     }
//     try {
//         const domainChats = []
//         for (let domain of domains) {
//             // Find the users who have this domain
//             const userInDomain = await User.find({ domain: domain }).select("_id");
//             // if(!userInDomain.length){
//             //     return res.status(404).send({success: false,message: `No users found for domain ${domain}`})
//             // }

//             //checking whether a group chat is already exist for this domain
//             let groupChat = await Chat.findOne({
//                 name: domain,
//                 IsDomainSpecific: true,
//                 isBatchChat: false
//             });

//             if (!groupChat) {
//                 groupChat = await Chat.create({
//                     name: domain,
//                     IsDomainSpecific: true,
//                     isBatchChat: false,
//                     participants: userInDomain.map(user => user._id), //adding all the users of the domain
//                     groupAdmin: userInDomain[0] // here groupadmin is college so i change it later
//                 });
//             }
//             //if the groupchat already exist , update the participants by adding users which is not added in the group
//             else {
//                 const existingParticipants = groupChat.participants.map(user => user.toString());
//                 const newParticipants = userInDomain.filter(user => !existingParticipants.includes(user._id.toString()))
//                     .map(user => user._id)

//                 if (newParticipants.length) {
//                     groupChat.participants.push(...newParticipants);
//                     await groupChat.save()
//                 }
//             }

//             // populate the chat fields and push to result away
//             groupChat = await Chat.findOne({ _id: groupChat._id })
//                 .populate("participants", "-password")
//                 .populate("groupAdmin", "-password")

//             domainChats.push(groupChat)
//         }

//         return res.status(200).json({ success: true, domainChats });
//     } catch (error) {
//         console.log(error)
//         return res.status(500).send("Some Internal error is present")
//     }

// })

router.post("/groupchatbaseddomain",fetchuser ,async (req, res) => {
    const { domains } = req.body;
    const collegeId=req.user.collegeId;

    if (!domains || !domains.length || !collegeId) {
        return res.status(400).send({ success: false, message: "Please provide all the details" });
    }

    try {
        // Find the college to fetch its student database
        const college = await College.findById(collegeId).populate("studentDatabase.student");
        if (!college) {
            return res.status(404).send({ success: false, message: "College not found" });
        }

        const domainChats = [];

        for (let domain of domains) {
            // Find students in the college with the given domain
            const userInDomain = college.studentDatabase
                .filter(studentEntry => studentEntry.student.domain.includes(domain))
                .map(studentEntry => studentEntry.student._id);

            // If no users are found for this domain, skip creating/updating the group
            if (!userInDomain.length) continue;

            // Check if a group chat already exists for the domain
            let groupChat = await Chat.findOne({
                name: domain,
                IsDomainSpecific: true,
                isBatchChat: false,
                groupAdmin: collegeId, // Ensure the admin is the college
            });

            if (!groupChat) {
                // Create a new group chat if it doesn't exist
                groupChat = await Chat.create({
                    name: domain,
                    IsDomainSpecific: true,
                    isBatchChat: false,
                    participants: userInDomain, // Add all users in the domain
                    groupAdmin: collegeId, // Set the college as admin
                });
            } else {
                // Update the existing group chat by adding new participants
                const existingParticipants = groupChat.participants.map((user) => user.toString());
                const newParticipants = userInDomain.filter(
                    (userId) => !existingParticipants.includes(userId.toString())
                );

                if (newParticipants.length) {
                    groupChat.participants.push(...newParticipants);
                    await groupChat.save();
                }
            }

            // Populate the group chat details
            groupChat = await Chat.findById(groupChat._id)
                .populate("participants", "-password")
                .populate("groupAdmin", "-adminPassword");

            domainChats.push(groupChat);
        }

        return res.status(200).json({ success: true, domainChats });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" });
    }
});



//...creating a group chat based on the batch...//
// router.post("/groupchatbasedbatch", fetchuser, async (req, res) => {
//     const { batches } = req.body;
//     if (!batches || !batches.length) {
//         return res.status(400).send({ success: false, message: "Please provider all the details" })
//     }
//     try {
//         const batchChats = []
//         for (let batch of batches) {
//             // Find the users who have this domain
//             const userInBatch = await User.find({ batch: batch }).select("_id");
//             // if(!userInDomain.length){
//             //     return res.status(404).send({success: false,message: `No users found for domain ${domain}`})
//             // }

//             //checking whether a group chat is already exist for this domain
//             let groupChat = await Chat.findOne({
//                 name: batch,
//                 IsDomainSpecific: false,
//                 isBatchChat: true
//             });

//             if (!groupChat) {
//                 groupChat = await Chat.create({
//                     name: batch,
//                     IsDomainSpecific: false,
//                     isBatchChat: true,
//                     participants: userInBatch.map(user => user._id), //adding all the users of the domain
//                     groupAdmin: userInBatch[0] // here groupadmin is college so i change it later and i think the college is the first to login and added in the group so i make the first object as admin
//                 });
//             }
//             //if the groupchat already exist , update the participants by adding users which is not added in the group
//             else {
//                 const existingParticipants = groupChat.participants.map(user => user.toString());
//                 const newParticipants = userInBatch.filter(user => !existingParticipants.includes(user._id.toString()))
//                     .map(user => user._id)

//                 if (newParticipants.length) {
//                     groupChat.participants.push(...newParticipants);
//                     await groupChat.save()
//                 }
//             }

//             // populate the chat fields and push to result away
//             groupChat = await Chat.findOne({ _id: groupChat._id })
//                 .populate("participants", "-password")
//                 .populate("groupAdmin", "-password")

//             batchChats.push(groupChat)
//         }

//         return res.status(200).json({ success: true, batchChats });
//     } catch (error) {
//         console.log(error)
//         return res.status(500).send("Some Internal error is present")
//     }

// })

router.post("/groupchatbasedbatch",fetchuser, async (req, res) => {
    const {batches } = req.body; // College ID provided in the request body
    const collegeId=req.user.collegeId

    if (!collegeId) {
        return res.status(400).send({ success: false, message: "Please provide a college ID" });
    }

    try {
        // Find the college and populate the student database with student IDs
        const college = await College.findById(collegeId).populate("studentDatabase.student");
        if (!college) {
            return res.status(404).send({ success: false, message: "College not found" });
        }

        const batchChats = [];

        for (let batch of batches) {
            // Find students belonging to the current batch
            const usersInBatch = college.studentDatabase
                .filter(entry => entry.student.batch === batch)
                .map(entry => entry.student._id);

            if (!usersInBatch.length) {
                continue; // Skip creating a group if no students found in this batch
            }

            // Check if a group chat already exists for this batch
            let groupChat = await Chat.findOne({
                name: batch, // Name the group based on batch number
                IsDomainSpecific: false,
                isBatchChat: true,
                groupAdmin: collegeId, // The admin is the college
            });

            if (!groupChat) {
                // Create a new group chat if it doesn't exist
                groupChat = await Chat.create({
                    name: batch,
                    IsDomainSpecific: false,
                    isBatchChat: true,
                    participants: usersInBatch, // Add all students from the batch
                    groupAdmin: collegeId, // Set the college as admin
                });
            } else {
                // Update the existing group chat by adding new participants
                const existingParticipants = groupChat.participants.map(user => user.toString());
                const newParticipants = usersInBatch.filter(user => !existingParticipants.includes(user.toString()));

                if (newParticipants.length) {
                    groupChat.participants.push(...newParticipants);
                    await groupChat.save();
                }
            }

            // Populate the group chat details
            groupChat = await Chat.findById(groupChat._id)
                .populate("participants", "-password")
                .populate("groupAdmin", "-adminPassword");

            batchChats.push(groupChat);
        }

        return res.status(200).json({ success: true, batchChats });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" });
    }
});




//...remove participants from the group...//
router.put("/removefromgroup", fetchuser, async (req, res) => {
    const { chatId, userId } = req.body;
    try {
        let chat = await Chat.findById(chatId).populate("groupAdmin", "-password");
        if (!chat) {
            return res.status(200).send({ success: false, message: "Chat is not found" });
        }
        if (chat.groupAdmin._id.toString() !== req.user._id.toString()) {
            return res.status(403).send({ success: false, message: "Unauthorized" })
        }
        const removed = await Chat.findByIdAndUpdate(chatId, {
            $pull: { participants: userId }
        }, { new: true }).populate("participants", "-password").populate("groupAdmin", "-password");
        if (!removed) {
            return res.status(404).send({ success: false, message: "Chat Not Found" });
        }
        else {
            return res.status(200).json({ success: true, removed });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send("Some internal error has been occured");
    }

})


//...fetching all the participants of a particular chat ...//
router.get("/fetchparticipants/:chatId", async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const participants = await Chat.findById(chatId).populate("participants");
        return res.status(200).json(participants);
    } catch (error) {
        console.log(error)
        return res.status(500).send("Some internal issue is present");
    }
})


//... delete a particular chat by its chatId
router.delete("/deletechat/:chatId", fetchuser, async (req, res) => {
    const chatId = req.params.chatId;
    const userId = req.user._id;
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(200).send("No chats is present")
        }
        if (chat.isBatchChat == true || chat.IsDomainSpecific == true) {
            chat.participants = chat.participants.filter(user => user.toString() !== userId);
            await chat.save()
        }
        await Message.deleteMany({ chatId: chatId })
        await Chat.findByIdAndDelete(chatId)

        return res.status(200).json({ success: true, message: "Chat deleted Successfully" });
    } catch (error) {
        console.log(error)
        return res.status(500).send("Some internal issue is present");
    }
})

module.exports = router