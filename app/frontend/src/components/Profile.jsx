import React, { useEffect, useState } from 'react'
import smallLogo from "../assets/smallLogo.png"
import { Menu as MenuIcon, X } from "lucide-react"
import { Link } from 'react-router-dom'
import Menu from './Menu'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

function Profile() {
    const [menuVisible, setMenuVisible] = useState(false)
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)
    const [username, setUsername] = useState(null)
    const [email, setEmail] = useState(null)

    const handleMenu = () => {
        setMenuVisible(!menuVisible)
    }

    useEffect(() => {
        setEmail(userData?.email)
        setUsername(userData?.username)
    }, [userData])

    useEffect(() => {
        toast.success(`Welcome! ${userData?.username}.`)
    }, [])

    return (
        <div className='w-screen h-screen overflow-hidden'>
            {/* larger screens */}
            <div className='hidden lg:flex w-full h-full bg-primary p-10 relative'>
                <Menu authStatus={authStatus} menuVisible={menuVisible} screenType={"larger"} handleMenu={handleMenu} />
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
                                        <MenuIcon className='text-accent text-2xl font-bold h-12 w-12' />
                                    </button>
                                </div>
                            </div>
                            <div className='row-span-1 flex justify-center items-center'>
                                <p className='text-accent font-bold font-outfit tracking-wider text-2xl uppercase'>{username}</p>
                            </div>
                            <div className='row-span-1 flex justify-center items-center'>
                                <p className='text-accent font-bold font-outfit tracking-wider text-2xl uppercase'>{email}</p>
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
                <Menu authStatus={authStatus} menuVisible={menuVisible} screenType={"smaller"} handleMenu={handleMenu} />
                <div className='bg-bg w-full h-full grid grid-rows-8'>
                    <div className='row-span-2 grid grid-rows-3 bg-menu'>
                        <div className='row-span-1 flex justify-around items-center'>
                            <div>
                                <img src={smallLogo} alt="logo" className='object-cover w-40' />
                            </div>
                            <div className='bg-menu'>
                                <button onClick={handleMenu} className='w-full h-full flex justify-center items-center cursor-pointer'>
                                    <MenuIcon className='text-accent text-2xl font-bold h-12 w-12' />
                                </button>
                            </div>
                        </div>
                        <div className='row-span-1 flex justify-center items-center'>
                            <p className='text-accent font-bold font-outfit tracking-wider text-2xl uppercase'>{username}</p>
                        </div>
                        <div className='row-span-1 flex justify-center items-center'>
                            <p className='text-accent font-bold font-outfit tracking-wider text-2xl uppercase'>{email}</p>
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