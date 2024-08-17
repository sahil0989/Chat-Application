import express from "express"
import { createConversation, getConversation, getUserConversationDetails } from "../controllers/ConversationController.js";
const router = express.Router();

router.post("/", createConversation);

router.get("/:userId", getConversation);

router.get("/details/:chatId", getUserConversationDetails);

export default router;