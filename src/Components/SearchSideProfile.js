import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

export default function SearchSideProfile({ user, visible, setVisible, setConversation }) {

    const { currentUser } = useContext(AuthContext)

    const handleFunc = async () => {
        try {
            setVisible(!visible)
            const res = await fetch(`${process.env.REACT_APP_BACKEND}/conversation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    senderId: currentUser?._id,
                    receiverId: user?._id
                })
            })
            const data = await res.json();
            setConversation((prev) => {
                if (!prev.some(item => item?._id === data?._id)) {
                    return [...prev, data];
                }
                return prev;
            })
        } catch (err) {
            console.log("Conversation Error: ", err.message);
        }
    }

    return (
        <div onClick={handleFunc} className='py-3 px-4 mt-4 rounded-lg flex gap-6 items-center hover:bg-white/10 cursor-pointer'>
            <div className='relative'>
                <img src={user.profilePic} className='w-12 h-12 rounded-full object-cover' alt='profile' />

            </div>
            <div>
                <h2 className='font-semibold'>{user.name}</h2>
                <p className='text-white/50 mt-1 text-sm'>@{user.username}</p>
            </div>
        </div>
    )
}
