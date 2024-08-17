import Message from "../models/message.js";

const addMessage = async (req, res) => {
    const newMessage = new Message(req.body);
    try {
        const response = await newMessage.save();

        res.status(200).json(response);

    } catch (err) {
        console.log("Add Message Error: ", err.message);
    }
}

const getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const response = await Message.find({
            chatId
        })

        res.status(200).json(response);
    } catch (err) {
        console.log("Get Message Error: ", err.message);
    }
}

export { addMessage, getMessages };