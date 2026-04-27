import React, { useState } from 'react'
import smallLogo from "../assets/smallLogo.png"
import coverImage from "../assets/covers/submission_cover.jpg"
import { Menu, X } from "lucide-react"
import { Link } from 'react-router-dom'

function Submission() {
    const [preview, setPreview] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false)

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };


    const handleMenu = () => {
        setMenuVisible(!menuVisible)
    }
    return (
        <div className='w-screen h-screen overflow-hidden'>


            {/* large screens */}
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
                <div className='bg-bg w-full h-full grid grid-cols-2 rounded-xl'>
                    <div className='col-span-1 bg-no-repeat bg-cover bg-center rounded-xl flex items-end px-6 py-6' style={{ backgroundImage: `url(${coverImage})` }}>
                        <a href="https://in.pinterest.com/pin/848084173618076404/" target='_blank' className='text-white uppercase font-outfit font-bold text-xl underline'>Credit</a>
                    </div>
                    <div className='bg-menu w-full h-full rounded-xl grid grid-rows-8'>
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
                        <div className='row-span-7 flex justify-center items-start overflow-y-scroll'>
                            <form className='max-w-100 max-h-100 px-6 py-6 flex justify-start items-center flex-col gap-2'>
                                <div className="w-full max-w-sm">
                                    <label className="relative block cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div className="w-full h-48 border-2 border-dashed border-accent rounded-xl flex items-center justify-center overflow-hidden bg-menu hover:bg-primary transition">

                                            {preview ? (
                                                <img
                                                    src={preview}
                                                    alt="preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <p className="text-accent font-poppins uppercase">
                                                    Upload image
                                                </p>
                                            )}

                                        </div>

                                    </label>
                                </div>
                                <div className='w-full flex flex-col justify-center items-start'>
                                    <label htmlFor="title" className='font-bold font-outfit uppercase'>title</label>
                                    <input type="text" id="title" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                                </div>
                                <div className='w-full flex flex-col justify-center items-start'>
                                    <label htmlFor="description" className='font-bold font-outfit uppercase'>Description</label>
                                    <textarea row="6" id="description" className='border-accent border-4 w-full h-40 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                                </div>
                                <div className='w-full flex justify-center items-start gap-2'>
                                    <div className='flex-1 flex justify-center items-start flex-col'>
                                        <label htmlFor="releaseYear" className='font-bold font-outfit uppercase'>Release Year</label>
                                        <input type="text" id="releaseYear" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                                    </div>
                                    <div className='flex-1 flex justify-center items-start flex-col'>
                                        <label htmlFor="genre" className='font-bold font-outfit uppercase'>Genre</label>
                                        <input type="text" id="genre" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                                    </div>
                                </div>
                                <div className='w-full flex flex-col justify-center items-start py-2'>
                                    <label htmlFor="tags" className='font-bold font-outfit uppercase'>Tags</label>
                                    <input type="text" id="tags" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                                </div>
                                <div className='row-span- flex justify-center items-center'>
                                    <button className='font-bold font-outfit tracking-wider bg-accent cursor-pointer text-white uppercase px-10 py-4 rounded-md text-xl' >Add Edit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* smaller screens */}
            <div className='lg:hidden flex w-full h-full bg-primary p-6 relative'>
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
                <div className='bg-menu w-full h-full rounded-xl grid grid-rows-8'>
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
                    <div className='row-span-7 overflow-y-scroll'>
                        <form className='w-full h-full px-6 py-6 flex justify-start items-center flex-col gap-2'>
                            <div className="w-full max-w-sm">
                                <label className="relative block cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="w-full h-48 border-2 border-dashed border-accent rounded-xl flex items-center justify-center overflow-hidden bg-menu hover:bg-primary transition">

                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <p className="text-accent font-poppins uppercase">
                                                Upload image
                                            </p>
                                        )}

                                    </div>

                                </label>
                            </div>
                            <div className='w-full flex flex-col justify-center items-start px-6 md:px-40'>
                                <label htmlFor="title" className='font-bold font-outfit uppercase'>title</label>
                                <input type="text" id="title" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                            </div>
                            <div className='w-full flex flex-col justify-center items-start px-6 md:px-40'>
                                <label htmlFor="description" className='font-bold font-outfit uppercase'>Description</label>
                                <textarea row="6" id="description" className='border-accent border-4 w-full h-40 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                            </div>
                            <div className='w-full flex justify-center items-start gap-2 px-6 md:px-40'>
                                <div className='w-40 flex justify-center items-start flex-col'>
                                    <label htmlFor="releaseYear" className='font-bold font-outfit uppercase'>Release Year</label>
                                    <input type="text" id="releaseYear" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                                </div>
                                <div className='w-40 flex justify-center items-start flex-col'>
                                    <label htmlFor="genre" className='font-bold font-outfit uppercase'>Genre</label>
                                    <input type="text" id="genre" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                                </div>
                            </div>
                            <div className='w-full flex flex-col justify-center items-start py-2 px-6 md:px-40'>
                                <label htmlFor="tags" className='font-bold font-outfit uppercase'>Tags</label>
                                <input type="text" id="tags" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                            </div>
                            <div className='flex justify-center items-center'>
                                <button className='font-bold font-outfit tracking-wider bg-accent cursor-pointer text-white uppercase px-10 py-4 rounded-md text-xl' >Add Edit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Submission