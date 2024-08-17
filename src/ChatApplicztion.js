import React from 'react'
import Topbar from './elements/Topbar'
import SideBar from './Components/SideBar'

export default function ChatApplicztion() {

    return (
        <>
            <Topbar />
            <div className='bg-black overflow-hidden flex' style={{ height: `calc(100vh - 78px)` }}>
                <div className='w-full md:w-[350px] h-full'>
                    <SideBar />
                </div>
                <div className='hidden md:block md:flex-[6] bg-[#252525]'></div>
            </div>
        </>
    )
}
