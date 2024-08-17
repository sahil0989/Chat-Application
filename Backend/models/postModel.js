import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    text: {
        type: String,
        maxLength: 500
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    replies: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                require: true
            },
            userProfile: {
                type: String,
                require: true
            },
            text: {
                type: String,
                require: true
            },
            username: {
                type: String,
                require: true
            }, 
            postId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
                require: true
            }
        }
    ]
}, {
    timestamps: true
})

const Post = mongoose.model('Post', postSchema);

export default Post;