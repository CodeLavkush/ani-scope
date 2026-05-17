import React, { useState } from 'react'
import smallLogo from "../assets/smallLogo.png"
import smallerCoverImage from "../assets/covers/register_cover_h.jpg"
import registerCharacter from "../assets/register_character.png"
import coverImage from "../assets/covers/register_cover.jpg"
import { Eye, EyeOff } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import { Button, Loader } from "../components"
import { register } from "../api/auth.js"
import toast from 'react-hot-toast'
import { Input } from '../components'

function Register() {
    const [seePassword, setSeePassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: "",
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
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.username.length > 8 || formData.password.length > 8) {
            toast.error("Username and Password cannot contain more than 8 letters.")
            return
        }

        try {

            setLoading(true)
            const data = await register(formData)

            if (data?.success) {
                toast.success(data.message)
                navigate("/verification")
            }

        } catch (error) {
            console.error("ERROR:", error)
            toast.error(error.message || "something went wrong!")
        } finally {
            setFormData({
                username: "",
                email: "",
                password: "",
            })
            setLoading(false)
        }
    }
    return (
        <div className='w-screen h-screen overflow-hidden'>

            {/* larger screens */}
            <div className='hidden w-full h-full bg-primary lg:flex justify-center items-center lg:px-20 lg:py-10 xl:px-60 xl:py-20'>
                <div className='bg-menu w-full h-full rounded-xl grid grid-cols-2'>
                    <div className='col-span-1 bg-cover bg-center bg-no-repeat flex items-end px-6 py-6 rounded-xl' style={{ backgroundImage: `url(${coverImage})` }}>
                        <a href="https://in.pinterest.com/pin/1094937728165112342/" target='_blank' className='text-white uppercase font-outfit font-bold text-xl underline'>Credit</a>
                    </div>
                    <div className='col-span-1 grid grid-rows-8'>
                        <div className='row-span-1 flex justify-center items-center'>
                            <img src={smallLogo} alt="logo" className='object-cover w-60' />
                        </div>
                        <div className='row-span-2 flex justify-center items-center'>
                            <img src={registerCharacter} alt="character" className='object-cover w-40' />
                        </div>
                        <div className='row-span-4'>
                            <form onSubmit={handleSubmit} className='w-full h-full flex justify-center items-center flex-col gap-4 px-10 xl:px-20 2xl:px-40'>
                                <Input
                                    name={"username"}
                                    label={"username"}
                                    required={true}
                                    value={formData.username}
                                    onChange={handleChange}
                                />

                                <Input
                                    name={"email"}
                                    label={"email"}
                                    type={"email"}
                                    required={true}
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                                <Input
                                    name={"password"}
                                    label={"password"}
                                    type={"password"}
                                    required={true}
                                    value={formData.password}
                                    onChange={handleChange}
                                />

                                <Button
                                    type="submit"
                                    loading={loading}
                                    LoaderComponent={<Loader size={50} color="border-red-500" />}
                                >
                                    Register
                                </Button>
                            </form>
                        </div>
                        <div className='row-span-1'>
                            <div className='row-span-1 flex justify-center items-center'>
                                <p className='font-bold font-poppins tracking-wider'>Alreay have an account? <Link to="/login" className='underline'>Login Here</Link></p>
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
                            <img src={registerCharacter} alt="Login character" className='object-contain w-40' />
                        </div>
                        <div className='row-span-4'>
                            <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4 px-6 md:px-40'>
                                <Input
                                    name="username"
                                    label="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />

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
                            <p className='font-bold font-poppins tracking-wide'>Alreay have an account? <Link to="/login" className='underline'>Login Here</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register