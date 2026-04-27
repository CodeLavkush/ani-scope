import React, { useState } from 'react'
import smallLogo from "../assets/smallLogo.png"
import { Menu, X } from "lucide-react"
import { Link } from 'react-router-dom'

function Profile() {
    const [menuVisible, setMenuVisible] = useState(false)

    const handleMenu = () => {
        setMenuVisible(!menuVisible)
    }
    return (
        <div className='w-screen h-screen overflow-hidden'>
            <div className='hidden lg:flex w-full h-full bg-primary p-10 relative'>
                <div className={`max-w-100 h-full p-2 grid grid-rows-8 bg-primary absolute right-0 transition-all z-1 ${menuVisible ? "flex" : "hidden"}`}>
                    {["Home", "About", "Submission", "Lists"].map((value, index) => (
                        <Link to={`/${value.toLowerCase()}`} key={index} className='row-span-1 px-8 content-center text-xl font-poppins tracking-wider uppercase font-bold border-b-2 cursor-pointer active:bg-accent active:text-white'>{value}</Link>
                    ))}
                    <div className='row-span-2 flex justify-around items-center gap-10'>
                        {["Login", "Register"].map((value, index) => (
                            <Link to={`/${value.toLowerCase()}`} key={index} className='text-xl bg-accent text-white font-poppins font-medium tracking-wider px-8 py-4 rounded-md active:bg-bg active:text-black'>{value}</Link>
                        ))}
                    </div>
                    <div className='row-span-2'>
                        <button onClick={handleMenu} className='w-full h-full flex justify-start items-center cursor-pointer'>
                            <X className='text-accent text-2xl font-bold h-12 w-12' />
                        </button>
                    </div>
                </div>
                <div className='bg-bg w-full h-full grid grid-cols-2'>
                    <div className='col-span-1 grid grid-rows-8 overflow-y-auto'>
                        <div className='row-span-1 flex items-center px-10'>
                            <p className='font-extrabold font-outfit underline text-4xl uppercase text-accent tracking-wider'>Your edits</p>
                        </div>
                        <div className='row-span-7 flex flex-wrap justify-center gap-4 p-4 overflow-y-auto'>
                            {[...Array(100)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-[calc(20%-0.5rem)] aspect-square overflow-hidden"
                                >
                                    <img
                                        src="https://placehold.co/200x200"
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='col-span-1 bg-menu grid grid-rows-2'>
                        <div className='row-span-1 grid grid-rows-3'>
                            <div className='row-span-1 flex justify-around items-center'>
                                <div>
                                    <img src={smallLogo} alt="logo" className='object-cover w-60' />
                                </div>
                                <div className='bg-menu'>
                                    <button onClick={handleMenu} className='w-full h-full flex justify-center items-center cursor-pointer'>
                                        <Menu className='text-accent text-2xl font-bold h-12 w-12' />
                                    </button>
                                </div>
                            </div>
                            <div className='row-span-1 flex justify-center items-center'>
                                <p className='text-accent font-bold font-outfit tracking-wider text-2xl uppercase'>Username</p>
                            </div>
                            <div className='row-span-1 flex justify-center items-center'>
                                <p className='text-accent font-bold font-outfit tracking-wider text-2xl uppercase'>Email</p>
                            </div>
                        </div>
                        <div className='row-span-1 flex justify-center items-center'>
                            <button className='font-bold font-outfit tracking-wider bg-accent text-white uppercase px-10 py-4 cursor-pointer rounded-md text-xl' >Add Edit</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* smaller screens  */}
            <div className='lg:hidden flex w-full h-full bg-primary p-10 relative'>
                <div className={`md:max-w-100 w-full h-full p-2 grid grid-rows-8 bg-primary absolute right-0 transition-all z-1 ${menuVisible ? "flex" : "hidden"}`}>
                    {["Home", "About", "Submission", "Lists"].map((value, index) => (
                        <Link to={`/${value.toLowerCase()}`} key={index} className='row-span-1 px-8 content-center text-xl font-poppins tracking-wider uppercase font-bold border-b-2 cursor-pointer active:bg-accent active:text-white'>{value}</Link>
                    ))}
                    <div className='row-span-2 flex justify-around items-center gap-10'>
                        {["Login", "Register"].map((value, index) => (
                            <Link to={`/${value.toLowerCase()}`} key={index} className='text-xl bg-accent text-white font-poppins font-medium tracking-wider px-8 py-4 rounded-md active:bg-bg active:text-black'>{value}</Link>
                        ))}
                    </div>
                    <div className='row-span-2'>
                        <button onClick={handleMenu} className='w-full h-full flex justify-start items-center cursor-pointer'>
                            <X className='text-accent text-2xl font-bold h-12 w-12' />
                        </button>
                    </div>
                </div>
                <div className='bg-bg w-full h-full grid grid-rows-8'>
                    <div className='row-span-2 grid grid-rows-3 bg-menu'>
                        <div className='row-span-1 flex justify-around items-center'>
                            <div>
                                <img src={smallLogo} alt="logo" className='object-cover w-40' />
                            </div>
                            <div className='bg-menu'>
                                <button onClick={handleMenu} className='w-full h-full flex justify-center items-center cursor-pointer'>
                                    <Menu className='text-accent text-2xl font-bold h-12 w-12' />
                                </button>
                            </div>
                        </div>
                        <div className='row-span-1 flex justify-center items-center'>
                            <p className='text-accent font-bold font-outfit tracking-wider text-2xl uppercase'>Username</p>
                        </div>
                        <div className='row-span-1 flex justify-center items-center'>
                            <p className='text-accent font-bold font-outfit tracking-wider text-2xl uppercase'>Email</p>
                        </div>
                    </div>
                    <div className='row-span-6 grid grid-rows-8'>
                        <div className='row-span-1 flex justify-center items-center'>
                            <p className='font-bold font-outfit underline text-2xl uppercase text-accent tracking-wider'>Your edits</p>
                        </div>
                        <div className="row-span-6 flex flex-wrap justify-center gap-4 p-4 overflow-y-auto">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-[calc(50%-0.5rem)] md:w-[calc(30%-0.5rem)] aspect-square overflow-hidden"
                                >
                                    <img
                                        src="https://placehold.co/200x200"
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className='row-span-1 flex justify-center items-center border-t-2'>
                            <button className='font-bold font-outfit tracking-wider bg-accent cursor-pointer text-white uppercase px-10 py-4 rounded-md text-xl' >Add Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile