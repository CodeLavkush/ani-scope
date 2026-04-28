import React, { useState } from 'react'
import smallLogo from "../assets/smallLogo.png"
import { Menu as MenuIcon, X } from "lucide-react"
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Menu from './Menu'

function Lists() {
    const [menuVisible, setMenuVisible] = useState(false)
    const authStatus = useSelector((state) => state.auth.status)

    const handleMenu = () => {
        setMenuVisible(!menuVisible)
    }
    return (
        <div className='w-screen h-screen overflow-hidden'>
            {/* large screens */}
            <div className='hidden lg:flex bg-primary w-full h-full p-10 relative'>
                <Menu authStatus={authStatus} menuVisible={menuVisible} screenType={"larger"} handleMenu={handleMenu} />
                <div className='bg-bg w-full h-full rounded-xl grid grid-rows-8'>
                    <div className='row-span-1 flex justify-around items-center px-10'>
                        <div>
                            <img src={smallLogo} alt="logo" className='object-cover w-40' />
                        </div>
                        <div>
                            <button onClick={handleMenu} className='w-full h-full flex justify-center items-center cursor-pointer'>
                                <MenuIcon className='text-accent text-2xl font-bold h-12 w-12' />
                            </button>
                        </div>
                    </div>
                    <div className='row-span-7 flex flex-col justify-center gap-4 p-4 overflow-y-auto pt-12'>
                        {[...Array(100)].map((_, i) => (
                            <div key={i} className='bg-btn w-full flex justify-start items-start rounded-xl hover:border-accent hover:border-2 hover:scale-90 cursor-pointer transition-all'>
                                <div className='h-full'>
                                    <img src="https://placehold.co/200x200" alt="" className='object-cover rounded-xl' />
                                </div>
                                <div className='flex justify-start items-start flex-col w-full gap-2'>
                                    <div className='flex justify-start items-center gap-4 py-4 px-4'>
                                        <p className='text-accent text-xl w-full uppercase font-extrabold font-outfit tracking-wide'>Your Name</p>
                                        <p className='font-medium font-poppins text-accent'>2018</p>
                                        <p className='font-medium font-poppins text-accent'>Romance</p>
                                    </div>
                                    <div className='flex justify-start items-center px-4'>
                                        <p className='font-poppins font-medium tracking-widest text-sm text-accent max-w-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem exercitationem hic aliquam animi quaerat impedit, deserunt nam cum amet vel.</p>
                                    </div>
                                </div>

                            </div>
                        ))}

                    </div>
                </div>
            </div>


            {/* smaller screens */}
            <div className='lg:hidden flex bg-primary w-full h-full p-10 relative'>
                <Menu authStatus={authStatus} menuVisible={menuVisible} screenType={"smaller"} handleMenu={handleMenu} />
                <div className='bg-bg w-full h-full rounded-xl grid grid-rows-8'>
                    <div className='row-span-1 flex justify-around items-center'>
                        <div>
                            <img src={smallLogo} alt="logo" className='object-cover w-40' />
                        </div>
                        <div>
                            <button onClick={handleMenu} className='w-full h-full flex justify-center items-center cursor-pointer'>
                                <MenuIcon className='text-accent text-2xl font-bold h-12 w-12' />
                            </button>
                        </div>
                    </div>
                    <div className='row-span-7 flex flex-wrap justify-center gap-4 p-4 overflow-y-auto'>
                        {[...Array(100)].map((_, i) => (
                            <div key={i} className='bg-btn w-60 h-68 pb-4 relative flex justify-end items-start px-12 flex-col'>
                                <div className='absolute -top-2 -right-2'>
                                    <img src="https://placehold.co/200x200" alt="" className='object-cover' />
                                </div>
                                <div className='flex justify-start items-start w-full flex-col gap-1'>
                                    <p className='text-accent text-xl w-full uppercase font-extrabold font-outfit tracking-wide'>Your Name</p>
                                    <div className='flex justify-start items-center gap-4'>
                                        <p className='font-medium font-poppins text-accent'>2018</p>
                                        <p className='font-medium font-poppins text-accent'>Romance</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Lists