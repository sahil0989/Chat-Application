import Conversation from "../models/conversation.js";

const createConversation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        if(!senderId || !receiverId) {
            return res.status(400).json({message: "Credentials missing!!"});
        }

        const existingConversation = await Conversation.findOne({
            members: { $all: [senderId, receiverId] }
        });

        if (existingConversation) {
            return res.status(200).json(existingConversation);
        }

        const newConv = new Conversation({
            members: [senderId, receiverId]
        });

        const response = await newConv.save();
        res.status(200).json(response);
    } catch (err) {
        console.log("Create Conversation Error: ", err.message);
        res.status(500).json({ message: "Server Error" });
    }
}


const getConversation = async (req, res) => {
    try {
        const { userId } = req.params;

        const response = await Conversation.find({
            members: { $in: [userId] }
        })

        res.status(200).json(response);
    } catch (err) {
        console.log("Get conversation err: ", err.message);
    }
}

const getUserConversationDetails = async (req, res) => {
    try {
        const { chatId } = req.params;
        const data = await Conversation.findById(chatId)

        res.status(200).json(data.members);
    } catch (err) {
        console.log("Conversation Details Error: ", err.message);
    }
}

export { createConversation, getConversation, getUserConversationDetails }