import React, { useState } from 'react'
import smallLogo from "../assets/smallLogo.png"
import smallerCoverImage from "../assets/covers/login_cover_h.jpg"
import loginCharacter from "../assets/login_character.png"
import coverImage from "../assets/covers/login_cover.jpg"
import { login as authLogin } from "../api/auth.js"
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Loader } from '../components'
import { useDispatch } from 'react-redux';
import { login, logout } from '../store/authSlice.js'
import toast from 'react-hot-toast'

function Login() {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

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
            setFormData({ email: "", password: "" })
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
                            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 px-10 xl:px-20 2xl:px-40">
                                <Input
                                    name="email"
                                    type="email"
                                    label="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                                <Input
                                    name="password"
                                    type="password"
                                    label="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                                <Button
                                    type="submit"
                                    loading={loading}
                                    LoaderComponent={<Loader size={50} color="border-red-500" />}
                                >
                                    Login
                                </Button>
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
                            <form className="w-full flex flex-col gap-4 px-6 md:px-40" onSubmit={handleSubmit}>
                                <Input
                                    name="email"
                                    type="email"
                                    label="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                                <Input
                                    name="password"
                                    type="password"
                                    label="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                                <Button
                                    type="submit"
                                    loading={loading}
                                    LoaderComponent={<Loader size={50} color="border-red-500" />}
                                >
                                    Login
                                </Button>
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