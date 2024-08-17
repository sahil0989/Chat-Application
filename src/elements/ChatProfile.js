import React, { useContext, useEffect, useState } from 'react'
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { IoSend } from "react-icons/io5";
import ChatBox from './ChatBox';
import AuthContext from '../context/AuthContext';

export default function ChatProfile() {

    const { id } = useParams();
    const { currentUser, socket, arrivalMessage } = useContext(AuthContext);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        const fetchConversation = async () => {
            const res = await fetch(`${process.env.REACT_APP_BACKEND}/conversation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    senderId: id,
                    receiverId: currentUser?._id
                })
            })
            const data = await res.json();
            console.log("Data: ", data);
            setChatId(data?._id);
            await fetchMessages(data?._id)
            await getUserDetails();
        }

        if (id) {
            fetchConversation();
        }
        // eslint-disable-next-line
    }, [navigate])

    useEffect(() => {
        arrivalMessage && userProfile?._id === arrivalMessage.sender && setMessages((prev) => [...prev, arrivalMessage])
        console.log("Arrival Message: ", arrivalMessage)
        // eslint-disable-next-line
    }, [arrivalMessage])

    const fetchMessages = async (id) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND}/message/${id}`)
        const data = await res.json();
        console.log("Messages: ", data)
        setMessages(data);
    }

    const getUserDetails = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL_USER}/${id}`)
            const data = await res.json();
            setUserProfile(data);
            console.log(data)
        } catch (err) {
            console.log("User Profile: ", err.message);
        }
    }

    const handleFunc = () => {
        navigate("/");
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const msg = {
            chatId: chatId,
            senderId: currentUser?._id,
            text: text,
        }

        socket?.current?.emit("sendMessage", {
            senderId: currentUser?._id,
            receiverId: id,
            text
        })

        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND}/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(msg)
            });
            const data = await res.json();
            setMessages([...messages, data])
            setText("");
        } catch (err) {
            console.log("Send Message Error: ", err.message);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    }

    return (
        <>
            <div className='w-full h-full overflow-hidden'>
                <div className='py-5 px-4 flex gap-6 items-center hover:bg-white/10 cursor-pointer bg-[#121212]'>
                    <FaArrowLeft size={18} onClick={handleFunc} className=' md:hidden' />
                    <div className='relative'>
                        <img src={userProfile?.profilePic} className='w-10 h-10 rounded-full object-cover' alt='profile' />
                    </div>
                    <div>
                        <h2 className='font-semibold'>{userProfile?.name} <span className='text-white/40 text-sm'>(@{userProfile?.username})</span></h2>
                        <p className='text-white/50 mt-1 text-sm'>Online</p>
                    </div>
                </div>
                <div className='flex flex-col justify-between w-full h-[calc(100vh-100px)] md:h-[calc(100vh-175px)]'>
                    <div className='h-full overflow-y-scroll overflow-x-hidden hide-scrollbar'>
                        <ChatBox messages={messages} />
                    </div>
                    <div className='rounded-full py-2 mx-5 flex gap-4 items-center'>
                        <input type='text'
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className='placeholder:text-white/30 bg-white/20 w-full px-5 py-2 rounded-full outline-none' placeholder='Enter a message' />
                        <IoSend size={22} onClick={handleSubmit} />
                    </div>
                </div>
            </div>
        </>
    )
}
