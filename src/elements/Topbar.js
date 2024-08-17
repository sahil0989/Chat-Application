import { SignOutButton } from '@clerk/clerk-react';
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Topbar() {

    const navigate = useNavigate();

    return (
        <div onClick={() => { navigate("/") }} className='bg-[#151515]z border-b border-white/20 py-4 md:py-6 px-10 font-bold text-xl cursor-pointer flex justify-between items-center'>
            <div>Mohmaya</div>
            <SignOutButton>
                <div>Logout</div>
            </SignOutButton>
        </div>
    )
}
