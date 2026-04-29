import React, { useState } from 'react'
import smallLogo from "../assets/smallLogo.png"
import smallerCoverImage from "../assets/covers/login_cover_h.jpg"
import loginCharacter from "../assets/login_character.png"
import coverImage from "../assets/covers/login_cover.jpg"
import { Eye, EyeOff } from "lucide-react"
import { login as authLogin } from "../api/auth.js"
import { Link, useNavigate } from 'react-router-dom'
import Loader from './Loader.jsx'
import { useDispatch } from 'react-redux';
import { login, logout } from '../store/authSlice.js'
import toast from 'react-hot-toast'

function Login() {
    const [seePassword, setSeePassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleSeePassword = (e) => {
        e.preventDefault()
        setSeePassword(!seePassword)
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.type === "email" ? "email" : "password"]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const data = await authLogin(formData)

            if (data?.success) {
                toast.success(data.message)
                dispatch(login(data.data.user))
                navigate("/home")
            }
        } catch (error) {
            console.error("ERROR: ", error)
            toast.error(error.message || "something went wrong!")
            dispatch(logout())
        }
        finally {
            formData.email = ""
            formData.password = ""
            setLoading(false)
        }
    }
    return (
        <div className='w-screen h-screen overflow-hidden'>

            {/* larger screens */}
            <div className='hidden w-full h-full bg-primary lg:flex justify-center items-center lg:px-20 lg:py-10 xl:px-60 xl:py-20'>
                <div className='bg-menu w-full h-full rounded-xl grid grid-cols-2'>
                    <div className='col-span-1 bg-cover bg-center bg-no-repeat flex items-end px-6 py-6 rounded-xl' style={{ backgroundImage: `url(${coverImage})` }}>
                        <a href="https://in.pinterest.com/pin/3799980930365602/" target='_blank' className='text-white uppercase font-outfit font-bold text-xl underline'>Credit</a>
                    </div>
                    <div className='col-span-1 grid grid-rows-8'>
                        <div className='row-span-1 flex justify-center items-center'>
                            <img src={smallLogo} alt="logo" className='object-cover w-60' />
                        </div>
                        <div className='row-span-2 flex justify-center items-center'>
                            <img src={loginCharacter} alt="character" className='object-cover w-40' />
                        </div>
                        <div className='row-span-4'>
                            <form onSubmit={handleSubmit} className='w-full h-full flex justify-center items-center flex-col gap-4'>
                                <div className='row-span-1 min-w-120 lg:min-w-100 px-10 flex flex-col justify-center items-start'>
                                    <label htmlFor="email" className='font-bold font-outfit uppercase'>Email</label>
                                    <input name='email' required onChange={handleChange} value={formData.email} type="email" id="email" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] outline-none p-2' />
                                </div>
                                <div className='row-span-1 min-w-120 lg:min-w-100 flex flex-col justify-center items-start relative px-10'>
                                    <label htmlFor="password" className='font-bold font-outfit uppercase'>Password</label>
                                    <input name='password' required onChange={handleChange} value={formData.password} type={`${seePassword ? "text" : "password"}`} id="password" className='border-accent border-4 lg:w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] outline-none p-2' />
                                    <button onClick={handleSeePassword} className='absolute right-8 top-10 lg:right-12 xl:right-14'>
                                        {
                                            seePassword ? <EyeOff /> : < Eye />
                                        }
                                    </button>
                                </div>
                                <div className='row-span-1 min-w-120 lg:min-w-100 px-10  mt-4 flex justify-center items-start'>
                                    <button className='bg-accent text-white cursor-pointer font-bold font-poppins tracking-wider w-full h-14 rounded-md uppercase text-xl'>
                                        {
                                            loading ? <Loader size={50} color="border-red-500" /> : "Login"
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className='row-span-1'>
                            <div className='row-span-1 flex justify-center items-center'>
                                <p className='font-bold font-poppins tracking-wider'>Don't Have An Account? <Link to="/register" className='underline'>Register Here</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* small screens */}
            <div className='w-full h-full bg-primary grid grid-rows-8 lg:hidden'>
                <div className='row-span-1 flex justify-center items-end'>
                    <img src={smallLogo} alt="logo" className='object-cover w-60' />
                </div>
                <div className='row-span-7 px-10 pb-10'>
                    <div className='bg-menu w-full h-full grid grid-rows-8 rounded-xl'>
                        <div className='row-span-1 bg-red-200'>
                            <img src={smallerCoverImage} alt="cover image" className='object-cover w-full h-full rounded-xl' />
                        </div>
                        <div className='row-span-2 flex justify-center items-center'>
                            <img src={loginCharacter} alt="Login character" className='object-contain w-40' />
                        </div>
                        <div className='row-span-4'>
                            <form onSubmit={handleSubmit} className='w-full h-full flex justify-center items-center flex-col gap-4'>
                                <div className='w-full flex flex-col justify-center items-start px-6 md:px-40'>
                                    <label htmlFor="email" className='font-bold font-outfit uppercase'>Email</label>
                                    <input name='email' required onChange={handleChange} value={formData.email} type="email" id="email" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                                </div>
                                <div className='w-full flex flex-col justify-center items-start relative px-6 md:px-40'>
                                    <label htmlFor="password" className='font-bold font-outfit uppercase'>Password</label>
                                    <input name='password' required onChange={handleChange} value={formData.password} type={`${seePassword ? "text" : "password"}`} id="password" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] outline-none p-2' />
                                    <button onClick={handleSeePassword} className='absolute right-8 top-10 md:top-10 md:right-44'>
                                        {
                                            seePassword ? <EyeOff /> : <Eye />
                                        }
                                    </button>
                                </div>
                                <div className='w-full flex justify-center items-start px-16 md:px-40'>
                                    <button className='bg-accent text-white font-bold font-poppins tracking-wider w-full h-14 rounded-md uppercase text-xl'>
                                        {
                                            loading ? <Loader size={50} color="border-red-500" /> : "Login"
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className='row-span-1 flex justify-center items-center'>
                            <p className='font-bold font-poppins tracking-wide'>Don't have an account? <Link to="/register" className='underline'>Register Here</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login