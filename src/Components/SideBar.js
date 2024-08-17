import React, { useContext, useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import SideProfile from '../elements/SideProfile';
import AuthContext from '../context/AuthContext';
import { ImCross } from "react-icons/im";
import { TiUserAdd } from "react-icons/ti";
import SearchSideProfile from './SearchSideProfile';

export default function SideBar() {
    const { currentUser, allUsers, onlineUsers, socket, users } = useContext(AuthContext);
    const [conversation, setConversation] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const getConversation = async () => {
            if (!currentUser?._id) return;
            try {
                const res = await fetch(`http://localhost:5000/conversation/${currentUser?._id}`);
                const data = await res.json();
                setConversation(data);
            } catch (err) {
                console.log("Get Conversation Error: ", err.message);
            }
        }
        getConversation();
    }, [currentUser]);

    const filterUsers = users.filter((user) => {
        return user.name?.toLowerCase().includes(searchQuery.toLocaleLowerCase()) || user.username?.toLocaleLowerCase().includes(searchQuery.toLowerCase())
    })

    return (
        <>
            <div className='bg-[#141414] w-full h-full relative'>
                <div className='bg-[#141414] w-full md:w-[350px] h-24 fixed'>
                    <div className='w-full h-full flex items-center justify-center'>
                        <div className='flex items-center py-2 px-5 w-full mx-8 rounded-full gap-3 bg-[#353535]'>
                            <IoSearch />
                            <input
                                type='text'
                                className='bg-transparent outline-none placeholder:text-white/40'
                                placeholder='Search'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className='w-full h-24'></div>
                <div className='w-full h-full overflow-scroll px-4 hide-scrollbar'>
                    {
                        conversation.length === 0 ? (
                            <p className='text-center text-white/40'>No conversations found</p>
                        ) : (
                            filterUsers.map((user, index) => (
                                <SideProfile key={index} user={user} index={index} conversation={conversation} currentUser={currentUser} onlineUsers={onlineUsers} socket={socket}
                                />
                            ))
                        )
                    }
                </div>
                <div onClick={() => setVisible(!visible)} className='absolute bottom-4 left-4 md:bottom-24 bg-[#353535] p-2 rounded-lg cursor-pointer'>
                    <TiUserAdd size={30} />
                </div>
            </div>

            <div id='modal-wrapper' className={`${visible ? "fixed" : "hidden"} z-10 inset-0`}>
                <div className='flex items-center justify-center min-h-screen bg-gray-500 bg-opacity-75 transition-all'>
                    <div className='relative flex flex-col items-center justify-between bg-[#353535] py-10 pt-16 px-4 rounded w-3/4 md:w-1/3 h-[calc(100vh-80px)] overflow-y-scroll overflow-x-hidden my-10 hide-scrollbar'>

                        <div className='flex items-center py-2 px-5 w-full rounded-full gap-3 bg-[#252525] md:mx-16'>
                            <IoSearch />
                            <input
                                type='text'
                                className='bg-transparent outline-none placeholder:text-white/40'
                                placeholder='Search'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className='w-full h-full overflow-scroll px-4 hide-scrollbar'>
                            {
                                allUsers?.map((user) => {
                                    return <SearchSideProfile key={user._id} user={user} setVisible={setVisible} visible={visible} setConversation={setConversation} />
                                })
                            }
                        </div>

                        <div onClick={() => setVisible(!visible)} className='absolute top-0 right-0 p-3 bg-red-600 hover:bg-red-700 cursor-pointer rounded-es-lg'>
                            <ImCross />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
