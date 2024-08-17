import User from "../models/userModel.js";

const signupUser = async (req, res) => {
    try {
        const { name, email, profilePic, username, userId } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return res.status(409).json({ message: "User already exists" });
        }

        const newUser = new User({
            name, email, username, userId, profilePic
        });
        await newUser.save();

        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                userId: newUser.userId,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (err) {
        console.log("SignUp User : ", err.message)
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, username } = req.body;

        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            res.status(201).json(user);
        } else {
            res.status(400).json({ message: "User not found" })
        }

    } catch (err) {
        console.log("Login Error : ", err.message);
    }
}

const followUnfollowUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findOne({ userId });

        if (currentUser._id == id) return res.status(400).json({ message: "You cnanot follow/unfollow yourself" });

        if (!currentUser || !userToModify) return res.status(400).json({ message: "User not found" });

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            await User.findByIdAndUpdate(currentUser._id, { $pull: { following: id } });
            await User.findByIdAndUpdate(id, { $pull: { followers: currentUser._id } });
            res.status(200).json({ message: "Unfollow Successfully" });
        } else {
            await User.findByIdAndUpdate(currentUser._id, { $push: { following: id } });
            await User.findByIdAndUpdate(id, { $push: { followers: currentUser._id } });
            res.status(200).json({ message: "Follow Successfully" });
        }

    } catch (err) {
        console.log("Follow Error : ", err.message);
    }
}

const userDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(400).json({ message: "User not found" });
        }
    } catch (err) {
        console.log("Details Error : ", err.message);
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, bio, userId } = req.body;

        const currentUser = await User.findOne({ userId });
        if (!currentUser) {
            return res.status(400).json({ message: "Current user not found" });
        }

        const updateUser = await User.findById(id);
        if (!updateUser) {
            return res.status(400).json({ message: "User not found" });
        }

        if (currentUser._id.toString() !== updateUser._id.toString()) {
            return res.status(400).json({ message: "You can't update another profile" });
        }

        updateUser.name = name || updateUser.name;
        updateUser.bio = bio || updateUser.bio;

        await updateUser.save();

        return res.status(200).json(updateUser);

    } catch (err) {
        console.log("Update Error: ", err.message);
    }
}

const userdata = async (req, res) => {
    try {
        const user = await User.find();

        return res.status(200).json(user);
    } catch (err) {
        console.log("All User Error: ", err.message);
    }
}

export { signupUser, loginUser, followUnfollowUser, userDetails, updateUser, userdata };