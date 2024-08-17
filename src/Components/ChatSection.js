import React from 'react'
import Topbar from '../elements/Topbar'
import SideBar from './SideBar'
import ChatProfile from '../elements/ChatProfile'

export default function ChatSection() {

    return (
        <>
            <div className='w-screen h-screen overflow-hidden'>
                <div className='hidden md:block'>
                    <Topbar />
                </div>
                <div className='bg-black flex h-screen'>
                    <div className='w-full hidden md:block md:w-[350px] h-full'>
                        <SideBar />
                    </div>
                    <div className='block md:flex-[6] bg-[#252525] w-full h-full'>
                        <ChatProfile />
                    </div>
                </div>
            </div>
        </>
    )
}
