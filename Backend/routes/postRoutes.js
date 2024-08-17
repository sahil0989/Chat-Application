import express from "express"
import { createPost, deletePost, deleteReply, fetchAllPost, fetchPostsByUser, fetchRepliesOnUserPosts, getPost, likeUnlike, replyToPost } from "../controllers/postController.js";

const router = express.Router();

router.post("/create-post", createPost);

router.get("/:id", getPost);

router.delete("/:id", deletePost);

router.post("/likeUnlike/:id", likeUnlike);

router.post("/reply/:id", replyToPost);

router.post("/reply-delete/:id", deleteReply);

router.get("/user/:id", fetchPostsByUser)

router.get("/replies/user/:userId", fetchRepliesOnUserPosts)

router.get("/fetch/allposts", fetchAllPost);

export default router;