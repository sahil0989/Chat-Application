import React, { useContext, useEffect } from 'react'
import Message from './Message';
import AuthContext from '../context/AuthContext';

export default function ChatBox({ messages }) {

    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const chatContainer = document.querySelector('.chat-container');

        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]);

    return (
        <div className='flex flex-col gap-2 py-4 px-3 w-full h-full'>
            {
                messages.length === 0 ? (
                    <div className='flex w-full h-full items-center justify-center'>Start a Conversation</div>
                ) : (
                    <div className="flex flex-col flex-grow p-4 overflow-auto chat-container hide-scrollbar">
                        {messages.map((message, index) => (
                            <Message key={index} own={currentUser?._id === message.senderId} text={message.text} />
                        ))}
                    </div>
                )
            }
        </div>
    )
}
