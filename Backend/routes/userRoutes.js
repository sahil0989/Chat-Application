import express from "express";
import { followUnfollowUser, loginUser, signupUser, updateUser, userdata, userDetails } from "../controllers/userControllers.js";

const router = express.Router();

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.get("/follow-user/:id", followUnfollowUser);

router.get("/:id", userDetails);

router.post("/update/:id", updateUser);

router.get("/data/xyz", userdata);

export default router;