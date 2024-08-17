import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    chatId:{
        type: String
    },
    senderId: {
        type: String
    },
    text: {
        type: String,
        require: true
    }
}, {
    timestamps: true
})

const Message = mongoose.model('Message', messageSchema);

export default Message;