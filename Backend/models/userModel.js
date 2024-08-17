import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        require : true,
        unique: true
    },
    bio: {
        type: String,
        default: ""
    },
    followers: {
        type: [String],
        default: [],
    },
    following: {
        type: [String],
        default: []
    }
}, {
    timestamps: true,
})

const User = mongoose.model('User', userSchema);

export default User;