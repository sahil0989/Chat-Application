import Post from "../models/postModel.js";
import User from "../models/userModel.js";

const createPost = async (req, res) => {
    try {
        const { postedBy, text, userId } = req.body;

        if (!postedBy || !text) {
            return res.status(400).json({ message: "Postedby and text field are required" });
        }

        const user = await User.findById(postedBy);
        const currentUser = await User.findOne({ userId })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (user._id.toString() !== currentUser._id.toString()) {
            return res.status(404).json({ message: "Unauthorized by create post." });
        }

        const maxLength = 500;

        if (text.lenth > maxLength) {
            return res.status(400).json({ message: `Text must be less than ${maxLength} characters.` })
        }

        const newPost = new Post({ postedBy, text });

        await newPost.save();

        res.status(201).json(newPost);
    } catch (err) {
        console.log("Create Post Error: ", err.message);
    }
}

const getPost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        return res.status(200).json(post)
    } catch (err) {
        console.log("GetPost Error: ", err.message);
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        await Post.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.log("Delete Error: ", err.message);
    }
}

const likeUnlike = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const { userId } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({ message: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            return res.status(200).json({ message: "Unliked" })
        } else {
            await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
            return res.status(200).json({ message: "Liked" })
        }

    } catch (err) {
        console.log("Like error: ", err.message)
    }
}

const replyToPost = async (req, res) => {
    try {
        const { userId, profilePic, text, username } = req.body;
        const { id } = req.params;

        if (!text) {
            return res.status(400).json({ message: "Text required" });
        }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(400).json({ message: "Post not found" });
        }

        const reply = { userId, userProfile: profilePic, text, username, postId: post._id };

        post.replies.unshift(reply);
        await post.save();

        return res.status(200).json(post);
    } catch (err) {
        console.log("Reply Error: ", err.message)
    }
}

const deleteReply = async (req, res) => {
    try {
        const { id: replyId } = req.params;
        const { postId } = req.body;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const replyIndex = post.replies.findIndex(reply => reply._id.toString() === replyId);

        if (replyIndex === -1) {
            return res.status(404).json({ message: "Reply not found" });
        }

        post.replies.splice(replyIndex, 1);
        await post.save();

        return res.status(200).json({ post });
    } catch (err) {
        console.log("Delete Reply Error: ", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const fetchPostsByUser = async (req, res) => {
    try {
        const { id } = req.params;

        const posts = await Post.find({ postedBy: id }).sort({ createdAt: -1 });

        if (!posts || posts.length === 0) {
            return res.status(404).json([]);
        }

        return res.status(200).json(posts);
    } catch (err) {
        console.log("Fetch Posts Error: ", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const fetchRepliesOnUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;

        const userPosts = await Post.find({ postedBy: userId });

        if (!userPosts || userPosts.length === 0) {
            return res.status(404).json([]);
        }

        const repliesByOtherUsers = userPosts.reduce((acc, post) => {
            const filteredReplies = post.replies.filter(reply => reply.userId.toString() !== userId);
            acc.push(...filteredReplies);
            return acc;
        }, []);

        return res.status(200).json(repliesByOtherUsers);
    } catch (err) {
        console.log("Fetch Replies Error: ", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const fetchAllPost = async (req, res) => {
    try {
        const post = await Post.find().sort({ createdAt: -1 });

        if (!post) {
            return res.status(400).json({ message: "No post available" });
        }

        return res.status(200).json(post);
    } catch (err) {
        console.log("All post error: ", err.message)
    }
}

export { createPost, getPost, deletePost, likeUnlike, replyToPost, deleteReply, fetchPostsByUser, fetchRepliesOnUserPosts, fetchAllPost };