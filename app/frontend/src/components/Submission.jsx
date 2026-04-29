import React, { useState, useEffect } from 'react'
import smallLogo from "../assets/smallLogo.png"
import coverImage from "../assets/covers/submission_cover.jpg"
import { Menu as MenuIcon, X } from "lucide-react"
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Menu from './Menu'
import { createMovie } from '../api/movie'
import toast from 'react-hot-toast'
import Loader from "./Loader.jsx"

function Submission() {
    const [preview, setPreview] = useState(null);
    const [processing, setProcessing] = useState(false)
    const [formData, setFormData] = useState({
        image: null,
        title: "",
        description: "",
        releaseYear: "",
        genre: "",
        tags: ""
    })

    const [menuVisible, setMenuVisible] = useState(false)
    const authStatus = useSelector((state) => state.auth.status)
    const handleMenu = () => {
        setMenuVisible(!menuVisible)
    }

    const handleChange = (e) => {
        const { id, value } = e.target

        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }


    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const imageUrl = URL.createObjectURL(file);

            setPreview(imageUrl);
            setFormData((prev) => ({
                ...prev,
                image: file
            }));
        }
    };

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    function throwInputFieldError(field, value, message) {
        if (field > value) {
            toast.error(message)
            return
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        throwInputFieldError(formData.title.length, 30, "Title is too long.")
        throwInputFieldError(formData.description.length, 200, "Description is too long.")
        throwInputFieldError(formData.releaseYear.length, 4, "Year must 4 digits long.")
        throwInputFieldError(formData.genre.length, 10, "Genre is too long.")

        let tags = formData.tags.split(",")
        let trimmedTags = tags.map((tag) => tag.trim())

        throwInputFieldError(trimmedTags.length, 4, "Only 4 tags are allowed.")


        try {
            const data = new FormData()
            setProcessing(true)

            data.append("poster", formData.image)
            data.append("title", formData.title)
            data.append("description", formData.description)
            data.append("releaseYear", formData.releaseYear)
            data.append("genre", formData.genre)
            data.append("tags", formData.tags)

            const res = await createMovie(data)
            console.log(res)

            if (res.success) {
                toast.success(res.message)

                setFormData({
                    image: null,
                    title: "",
                    description: "",
                    releaseYear: "",
                    genre: "",
                    tags: ""
                })

                setPreview(null)
            }

        } catch (error) {
            console.error(error)
            toast.error(error.message)
        } finally {
            setProcessing(false)
        }
    }

    return (
        <div className='w-screen h-screen overflow-hidden'>


            {/* large screens */}
            <div className='hidden lg:flex w-full h-full bg-primary p-10 relative'>
                <Menu authStatus={authStatus} menuVisible={menuVisible} screenType={"larger"} handleMenu={handleMenu} />
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
                                    <MenuIcon className='text-accent text-2xl font-bold h-12 w-12' />
                                </button>
                            </div>
                        </div>
                        <div className='row-span-7 flex justify-center items-start overflow-y-scroll'>
                            <form onSubmit={handleSubmit} className='max-w-100 max-h-100 px-6 py-6 flex justify-start items-center flex-col gap-2'>
                                <div className="w-full max-w-sm">
                                    <label className="relative block cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            required
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
                                    <input required onChange={handleChange} value={formData.title} type="text" id="title" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                                </div>
                                <div className='w-full flex flex-col justify-center items-start'>
                                    <label htmlFor="description" className='font-bold font-outfit uppercase'>Description</label>
                                    <textarea required onChange={handleChange} value={formData.description} row="6" id="description" className='border-accent border-4 w-full h-40 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                                </div>
                                <div className='w-full flex justify-center items-start gap-2'>
                                    <div className='flex-1 flex justify-center items-start flex-col'>
                                        <label htmlFor="releaseYear" className='font-bold font-outfit uppercase'>Release Year</label>
                                        <input required onChange={handleChange} value={formData.releaseYear} type="text" id="releaseYear" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                                    </div>
                                    <div className='flex-1 flex justify-center items-start flex-col'>
                                        <label htmlFor="genre" className='font-bold font-outfit uppercase'>Genre</label>
                                        <input required onChange={handleChange} value={formData.genre} type="text" id="genre" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                                    </div>
                                </div>
                                <div className='w-full flex flex-col justify-center items-start py-2'>
                                    <label htmlFor="tags" className='font-bold font-outfit uppercase'>Tags</label>
                                    <input required onChange={handleChange} value={formData.tags} type="text" id="tags" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                                </div>
                                <div className='row-span- flex justify-center items-center'>
                                    {
                                        processing ? <Loader size={50} color="border-red-500" /> : <button className='font-bold font-outfit tracking-wider bg-accent cursor-pointer text-white uppercase px-10 py-4 rounded-md text-xl' >Add Edit</button>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* smaller screens */}
            <div className='lg:hidden flex w-full h-full bg-primary p-6 relative'>
                <Menu authStatus={authStatus} menuVisible={menuVisible} screenType={"smaller"} handleMenu={handleMenu} />
                <div className='bg-menu w-full h-full rounded-xl grid grid-rows-8'>
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
                    <div className='row-span-7 overflow-y-scroll'>
                        <form onSubmit={handleSubmit} className='w-full h-full px-6 py-6 flex justify-start items-center flex-col gap-2'>
                            <div className="w-full max-w-sm">
                                <label className="relative block cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required
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
                                <input required onChange={handleChange} value={formData.title} type="text" id="title" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                            </div>
                            <div className='w-full flex flex-col justify-center items-start px-6 md:px-40'>
                                <label htmlFor="description" className='font-bold font-outfit uppercase'>Description</label>
                                <textarea required onChange={handleChange} value={formData.description} row="6" id="description" className='border-accent border-4 w-full h-40 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                            </div>
                            <div className='w-full flex justify-center items-start gap-2 px-6 md:px-40'>
                                <div className='w-40 flex justify-center items-start flex-col'>
                                    <label htmlFor="releaseYear" className='font-bold font-outfit uppercase'>Release Year</label>
                                    <input required onChange={handleChange} value={formData.releaseYear} type="text" id="releaseYear" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                                </div>
                                <div className='w-40 flex justify-center items-start flex-col'>
                                    <label htmlFor="genre" className='font-bold font-outfit uppercase'>Genre</label>
                                    <input required onChange={handleChange} value={formData.genre} type="text" id="genre" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                                </div>
                            </div>
                            <div className='w-full flex flex-col justify-center items-start py-2 px-6 md:px-40'>
                                <label htmlFor="tags" className='font-bold font-outfit uppercase'>Tags</label>
                                <input required onChange={handleChange} value={formData.tags} type="text" id="tags" className='border-accent border-4 w-full h-14 rounded-md shadow-[4px_4px_0px_0px_#4E361E] p-2 outline-none' />
                            </div>
                            <div className='flex justify-center items-center'>
                                {
                                    processing ? <Loader size={50} color="border-red-500" /> : <button className='font-bold font-outfit tracking-wider bg-accent cursor-pointer text-white uppercase px-10 py-4 rounded-md text-xl' >Add Edit</button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Submission