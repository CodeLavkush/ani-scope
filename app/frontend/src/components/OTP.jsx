import React, { useState } from 'react'
import smallLogo from "../assets/smallLogo.png"
import { useNavigate } from 'react-router-dom'
import { verifyEmail } from "../api/auth.js"
import Loader from './Loader.jsx'
import toast from 'react-hot-toast'

function OTP() {
    const navigate = useNavigate()
    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const data = await verifyEmail(otp)

            if (data?.success) {
                toast.success(data.message)
                navigate("/login")
            }
        } catch (error) {
            console.error("ERROR:", error)
            toast.error(error.message || "something went wrong!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-screen h-screen overflow-hidden'>

            {/* larger screens */}
            <div className='hidden lg:flex w-full h-full bg-primary  justify-center items-center'>
                <div className='bg-menu w-200 h-200 flex justify-center items-center rounded-xl'>
                    <div className='flex justify-between py-10 w-full h-full items-center flex-col gap-10'>
                        <div className='row-span-1 flex justify-center items-center'>
                            <img src={smallLogo} alt="logo" className='object-cover w-60' />
                        </div>
                        <div className='row-span-4'>
                            <form onSubmit={handleSubmit} className='w-full h-full flex justify-center items-center flex-col gap-4'>
                                <div className='row-span-1 min-w-120 lg:min-w-100 px-10 flex flex-col justify-center items-start'>
                                    <label htmlFor="otp" className='font-bold font-outfit uppercase'>OTP</label>
                                    <input name='otp' maxLength={6} required value={otp} onChange={(e) => setOtp(e.target.value)} type="text" id="otp" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] outline-none p-2' />
                                </div>
                                <div className='row-span-1 min-w-120 lg:min-w-100 px-10  mt-4 flex justify-center items-start'>
                                    <button className='bg-accent text-white cursor-pointer font-bold font-poppins tracking-wider w-full h-14 rounded-md uppercase text-xl'>
                                        {
                                            loading ? <Loader size={50} color="border-red-500" /> : "Verify"
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className='row-span-1'>
                            <div className='row-span-1 flex justify-center items-center'>
                                <p className='font-bold font-poppins tracking-wider underline'>Resend verification otp</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* small screens */}
            <div className='w-full h-full flex justify-center items-center bg-primary lg:hidden'>
                <div className='w-100 h-200 flex justify-center items-center gap-6 flex-col'>
                    <div className='row-span-1 flex justify-center items-end'>
                        <img src={smallLogo} alt="logo" className='object-cover w-60' />
                    </div>
                    <div className='bg-menu w-full h-full flex justify-center items-center flex-col rounded-xl py-10'>
                        <div className='w-full h-full px-10'>
                            <form className='w-full h-full flex justify-center items-center flex-col gap-4'>
                                <div className='w-full flex flex-col justify-center items-start'>
                                    <label htmlFor="otp" className='font-bold font-outfit uppercase'>OTP</label>
                                    <input name='otp' required maxLength={6} type="text" id="otp" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E]' />
                                </div>
                                <div className='w-full flex justify-center items-start'>
                                    <button className='bg-accent text-white font-bold font-poppins tracking-wider w-full h-14 rounded-md uppercase text-xl'>
                                        {
                                            loading ? <Loader size={50} color="border-red-500" /> : "Verify"
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className='flex justify-center items-center'>
                            <p className='font-bold font-poppins tracking-wide underline'>Resend verification otp</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OTP