import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext';

export default function SideProfile({ user, index }) {

    const navigate = useNavigate();

    const { onlineUsers } = useContext(AuthContext);
    const [online, setOnline] = useState(false)

    useEffect(() => {
        if (onlineUsers?.some(item => item?.userId === user?._id)) {
            setOnline(true);
        }
        console.log("Online Users: ", onlineUsers);
    }, [onlineUsers, user])

    const handleFunc = () => {
        navigate(`/${user?._id}`) 
        console.log(user.username," - ",user.name," - ", user._id)
    }

    return (
        <div onClick={handleFunc} className='py-3 px-4 mt-4 rounded-lg flex gap-6 items-center hover:bg-white/10 cursor-pointer'>
            <div className='relative'>
                <img src={user.profilePic} className='w-12 h-12 rounded-full object-cover' alt='profile' />
                {
                    online ? <div className='bg-green-500 w-3 h-3 rounded-lg absolute right-0 bottom-0'></div> : <></>
                }

            </div>
            <div>
                <h2 className='font-semibold'>{user.name}</h2>
                <p className='text-white/50 mt-1 text-sm'>Hye! Are you there ? {index}</p>
            </div>
        </div>
    )
}
