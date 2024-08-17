import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import conversationRouter from "./routes/ConversationRouter.js"
import messageRoutes from "./routes/messageRouter.js"
import cors from "cors"

dotenv.config();
connectDB();

const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRoutes)
app.use('/api/post', postRoutes)
app.use('/conversation', conversationRouter)
app.use('/message', messageRoutes)

app.listen(5000, () => {
    console.log(`Listening at PORT : ${PORT}`)
})