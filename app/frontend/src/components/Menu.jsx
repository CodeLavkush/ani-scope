import React from 'react'
import { logout as authLogout } from '../api/auth'
import { logout } from '../store/authSlice'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useGSAP } from "@gsap/react"
import gsap from 'gsap'
import { X } from 'lucide-react'

function Menu({ authStatus: status, screenType, menuVisible, handleMenu, closeBtn = true }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleClick = async () => {
        try {
            const data = await authLogout()
            if (data.success) {
                dispatch(logout())
                navigate("/home")
            }
        } catch (error) {
            console.error
        }
    }

    if (screenType === "larger") {
        return (
            <div className={`max-w-100 h-full p-2 grid grid-rows-8 bg-primary absolute right-0 transition-all z-1 ${menuVisible ? "flex" : "hidden"}`}>
                {["Home", "About", "Submission", "Lists"].map((value, index) => (
                    <Link to={`/${value.toLowerCase()}`} key={index} className='row-span-1 px-8 content-center text-xl font-poppins tracking-wider uppercase font-bold border-b-2 cursor-pointer active:bg-accent active:text-white'>{value}</Link>
                ))}
                <div className='row-span-2 flex justify-around items-center gap-10'>
                    {
                        status ? ["Profile", "Logout"].map((value, index) => {
                            if (value === "Profile") {
                                return (
                                    (
                                        <Link to={`/${value.toLowerCase()}`} key={index} className='text-xl bg-accent text-white font-poppins font-medium tracking-wider px-8 py-4 rounded-md active:bg-bg active:text-black'>{value}</Link>
                                    )
                                )
                            } else {
                                return (
                                    <button onClick={handleClick} key={index} className='text-xl bg-accent text-white font-poppins font-medium tracking-wider px-8 py-4 rounded-md active:bg-bg active:text-black'>{value}</button>
                                )
                            }
                        }) : ["Login", "Register"].map((value, index) => (
                            <Link to={`/${value.toLowerCase()}`} key={index} className='text-xl bg-accent text-white font-poppins font-medium tracking-wider px-8 py-4 rounded-md active:bg-bg active:text-black'>{value}</Link>
                        ))
                    }
                </div>
                <div className='row-span-2'>
                    <button onClick={handleMenu} className='w-full h-full flex justify-start items-center cursor-pointer'>
                        {
                            closeBtn ? (
                                <X className='text-accent text-2xl font-bold h-12 w-12' />
                            ) : null
                        }
                    </button>
                </div>
            </div>
        )
    }

    if (screenType === "smaller") {
        return (
            <div className={`mobile-menu w-full h-full grid grid-rows-8 bg-primary absolute transition-all z-1 ${menuVisible ? "flex" : "hidden"}`}>
                {["Home", "About", "Submission", "Lists"].map((value, index) => (
                    <Link to={`/${value.toLowerCase()}`} key={index} className='mobile-link row-span-1 px-8 content-center text-xl font-poppins tracking-wider uppercase font-bold border-b-2 cursor-pointer active:bg-accent active:text-white'>{value}</Link>
                ))}
                <div className='row-span-2 flex justify-around items-center gap-10'>
                    {
                        status ? ["Profile", "Logout"].map((value, index) => {
                            if (value === "Profile") {
                                return (
                                    (
                                        <Link to={`/${value.toLowerCase()}`} key={index} className='text-xl bg-accent text-white font-poppins font-medium tracking-wider px-8 py-4 rounded-md active:bg-bg active:text-black'>{value}</Link>
                                    )
                                )
                            } else {
                                return (
                                    <button onClick={handleClick} key={index} className='text-xl bg-accent text-white font-poppins font-medium tracking-wider px-8 py-4 rounded-md active:bg-bg active:text-black'>{value}</button>
                                )
                            }
                        }) : ["Login", "Register"].map((value, index) => (
                            <Link to={`/${value.toLowerCase()}`} key={index} className='text-xl bg-accent text-white font-poppins font-medium tracking-wider px-8 py-4 rounded-md active:bg-bg active:text-black'>{value}</Link>
                        ))
                    }
                </div>
                <div>
                    <div className='row-span-2'>
                        <button onClick={handleMenu} className='w-full h-full flex justify-start items-center cursor-pointer'>
                            {
                                closeBtn ? (
                                    <X className='text-accent text-2xl font-bold h-12 w-12' />
                                ) : null
                            }
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Menu