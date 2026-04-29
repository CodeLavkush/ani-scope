import React, { useEffect, useRef, useState } from 'react'
import smallLogo from "../assets/smallLogo.png"
import largeLogo from "../assets/largeLogo.png"
import largeBg from "../assets/mainBg.png"
import overlayBg from "../assets/overlay_bg.png"
import { Link, useNavigate } from "react-router-dom"
import { Menu as MenuIcon, X, ChevronLeft, ChevronRight, FastForward, Cookie } from "lucide-react";

import suzume from "../assets/SUZUME.jpg"
import yourName from "../assets/yourname.jpg"
import gardenofwords from "../assets/gardenofwords.jpg"
import jujutsuKaisen from "../assets/jujutsu_kaisen.jpg"

import { useGSAP } from "@gsap/react"
import gsap from 'gsap'

import { useSelector } from 'react-redux'
import Menu from './Menu'

import { logout as authLogout } from '../api/auth'
import { useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import toast from 'react-hot-toast'
import Loader from './Loader'
import { getMovies } from '../api/movie'

function Home() {
    const mainContainerRef = useRef()
    const authStatus = useSelector((state) => state.auth.status)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [menuVisible, setMenuVisible] = useState(false)

    // movies
    const [movies, setMovies] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [cursor, setCursor] = useState("")
    const [loading, setLoading] = useState(true)
    const [fetching, setFetching] = useState(false)


    //fetch movies
    const fetchMovies = async (nextCursor = "") => {
        if (fetching) return

        setFetching(true)
        try {
            const res = await getMovies(10, nextCursor)

            setMovies((prev) => [...prev, ...(res?.data.data || [])])
            setCursor(res?.data?.cursor || null)
        } catch (error) {
            console.error(error)
        } finally {
            setFetching(false)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMovies()
    }, [])

    // navigation
    const handleNext = async () => {
        const nextIndex = (currentIndex + 1) % movies.length
        setCurrentIndex(nextIndex)


        if (currentIndex >= movies.length - 2 && cursor) {
            fetchMovies(cursor)
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }

    const currentMovie = movies[currentIndex]

    // Animation on change
    useEffect(() => {
        if (!currentMovie) return

        gsap.fromTo(".mobile-hero-img",
            { opacity: 0, scale: 1.1 },
            { opacity: 1, scale: 1, duration: 0.5 }
        )
    }, [currentIndex])

    const handleMenu = () => {
        const tl = gsap.timeline();

        if (!menuVisible) {
            setMenuVisible(true);
            tl.fromTo(".mobile-menu",
                { x: "100%" },
                { x: "0%", duration: 0.5, ease: "power3.out" }
            )
                .from(".mobile-link", {
                    x: 50,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.3
                }, "-=0.2");
        } else {
            tl.to(".mobile-menu", {
                x: "100%",
                duration: 0.4,
                ease: "power3.in",
                onComplete: () => setMenuVisible(false)
            });
        }
    }

    const handleLogout = async () => {
        try {
            const data = await authLogout()
            if (data.success) {
                toast.success(data.message)
                dispatch(logout())
                navigate("/login")
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message || "something went wrong!")
        }
    }

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from(mainContainerRef.current, {
            opacity: 0,
            duration: 0.5
        })
            .from(".nav-item", {
                y: -50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1
            })
            .from(".year", {
                y: 40,
                opacity: 0,
                duration: 0.5
            }, "-=0.3")
            .from(".genre", {
                y: 40,
                opacity: 0,
                duration: 0.5
            }, "-=0.3")
            .from(".hero-title", {
                x: -100,
                opacity: 0,
                duration: 0.8
            }, "-=0.3")
            .from(".hero-desc", {
                y: 50,
                opacity: 0,
                duration: 0.6
            }, "-=0.4")
            .from(".tag-item", {
                y: 20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.4
            }, "-=0.3")
            .from(".card", {
                scale: 0.8,
                opacity: 0,
                duration: 0.5,
                stagger: 0.2,
                ease: "back.out(1.7)"
            }, "-=0.3");

        // Mobile animations
        gsap.from(".mobile-hero-img", {
            scale: 1.2,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });

        gsap.from(".mobile-year", {
            x: -30,
            opacity: 0,
            duration: 0.4
        });

        gsap.from(".mobile-genre", {
            x: -30,
            opacity: 0,
            duration: 0.4,
            delay: 0.1
        });

        gsap.from(".mobile-tag", {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.3,
            delay: 0.2
        });

        gsap.from(".mobile-title", {
            y: 30,
            opacity: 0,
            duration: 0.5,
            delay: 0.3
        });

        gsap.from(".mobile-desc", {
            y: 30,
            opacity: 0,
            duration: 0.5,
            delay: 0.5
        });

        gsap.from(".mobile-controls", {
            y: 50,
            opacity: 0,
            duration: 0.5,
            delay: 0.7
        });


        gsap.utils.toArray(".card").forEach((card) => {
            card.addEventListener("mouseenter", () => {
                gsap.to(card, { scale: 1.05, duration: 0.3 });
            });
            card.addEventListener("mouseleave", () => {
                gsap.to(card, { scale: 1, duration: 0.3 });
            });
        });
    }, { scope: mainContainerRef })


    if (loading) return <Loader />
    if (!movies.length) return <div className="text-accent text-xl font-bold font-poppins tracking-wider">No movies found</div>

    return (
        <div ref={mainContainerRef} className='w-screen h-screen overflow-hidden relative'>

            <img src={overlayBg} alt="overlay" className='absolute bottom-0 left-0 hidden lg:flex xl:flex z-1' />

            {/* Large screens */}
            <div className='hidden sm:hidden md:hidden lg:grid xl:grid grid-cols-16 w-full h-full bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(${currentMovie?.poster?.master})` }}>
                <div className='col-span-1'></div>
                <div className='col-span-5 grid lg:grid-rows-8 xl:grid-rows-12 z-10'>
                    <div className='lg:row-span-1 xl:row-span-1 flex justify-start items-center'>
                        <img src={largeLogo} alt="logo" className='object-cover max-w-60' />
                    </div>
                    <div className='lg:row-span-1 xl:row-span-2'></div>
                    <div className='row-span-1 grid grid-cols-4'>
                        <p className='year font-bold font-outfit text-4xl text-white tracking-wide col-span-1 text-start content-center'>{currentMovie?.releaseYear}</p>
                        <p className='genre font-medium font-outfit text-xl text-white tracking-wider col-span-2 xl:text-start lg:text-center  content-center'>{currentMovie?.genre}</p>
                    </div>
                    <div className='row-span-1 flex justify-start items-start'>
                        <h1 className='hero-title uppercase text-4xl font-outfit font-extrabold text-white tracking-tighter shrink max-w-sm'>{currentMovie?.title}</h1>
                    </div>
                    <div className='lg:row-span-2 xl:row-span-4 flex justify-start items-start pt-6'>
                        <p className='hero-desc text-white font-poppins text-sm tracking-widest font-medium lg:max-w-80 xl:max-w-md'>{currentMovie?.description}</p>
                    </div>
                    <div className='row-span-1'></div>
                    <div className='lg:row-span-1 xl:row-span-2 flex justify-start items-start gap-2 flex-wrap'>
                        {currentMovie?.tags.map((value, index) => (
                            <p key={index} className='tag-item font-poppins text-white lg:text-sm xl:text-md uppercase font-bold tracking-widest'>{value}</p>
                        ))}
                    </div>
                </div>
                <div className='col-span-5 grid lg:grid-rows-8 xl:grid-rows-8 w-full h-full z-10'>
                    <div className='row-span-1 grid grid-cols-4' >
                        {["Home", "About", "Submission", "Lists"].map((value, index) => (
                            <Link to={`/${value.toLowerCase()}`} key={index} className='nav-item col-span-1 text-center content-center lg:text-sm xl:text-xl font-outfit font-bold tracking-wider uppercase text-white cursor-pointer hover:underline'>{value}</Link>
                        ))}
                    </div>
                    <div className='lg:row-span-6 xl:row-span-4'>

                    </div>
                    <div className='row-span-3 grid grid-cols-2 pt-12'>
                        {
                            authStatus ? ["Profile", "Logout"].map((value, index) => {
                                if (value === "Profile") {
                                    return (
                                        <Link to={`/${value.toLowerCase()}`} key={index} className='nav-item col-span-1 text-white font-medium font-poppins text-2xl cursor-pointer hover:underline uppercase tracking-wider text-center content-center'>{value}</Link>
                                    )
                                } else {
                                    return (
                                        <button onClick={handleLogout} key={index} className='nav-item col-span-1 text-white font-medium font-poppins text-2xl cursor-pointer hover:underline uppercase tracking-wider text-center content-center'>{value}</button>
                                    )
                                }
                            }) : ["Login", "Register"].map((value, index) => (
                                <Link to={`/${value.toLowerCase()}`} key={index} className='nav-item col-span-1 text-white font-medium font-poppins text-2xl cursor-pointer hover:underline uppercase tracking-wider text-center content-center '>{value}</Link>
                            ))
                        }
                    </div>
                </div>
                <div className='col-span-4'>
                    <div className='movie-scroll inset-0 backdrop-blur-md bg-white/1 w-full h-full flex flex-col lg:justify-center xl:justify-start items-center p-6 gap-8 overflow-y-scroll'>
                        {
                            movies.map((movie, index) => (
                                <div onClick={() => setCurrentIndex(index)} key={movie.title} className='card border-2 border-white lg:w-60 xl:w-80 shadow-[8px_12px_0px_0px_#ffffff] cursor-pointer relative'>
                                    <img src={movie.poster.large} className='object-cover w-full h-full' alt={movie.title} />
                                    <p className='absolute top-0 right-2 font-bold uppercase text-white'>{movie.title}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='col-span-1'></div>
            </div>


            {/* for smaller screens */}
            <div className="w-full h-full grid grid-rows-12 bg-primary lg:hidden relative">
                <Menu authStatus={authStatus} menuVisible={menuVisible} screenType={"smaller"} handleMenu={handleMenu} closeBtn={false} />
                <div className='row-span-2 grid grid-rows-2'>
                    <div className='grid grid-cols-2'>
                        <div className='col-span-1 flex justify-center px-4 flex-col'>
                            <h2 className='mobile-year text-2xl font-extrabold font-outfit text-accent tracking-wide'>{currentMovie?.releaseYear || "N/A"}</h2>
                            <p className='mobile-genre text-md font-bold font-outfit tracking-widest text-accent'>{currentMovie?.genre || "Unknown"}</p>
                        </div>
                        <div className='col-span-1 uppercase font-outfit font-bold flex justify-end items-center pr-10'>
                            <img src={smallLogo} alt='logo' />
                        </div>
                    </div>
                    <div className='flex justify-start items-center pl-4'>
                        <p className='mobile-tag font-bold text-accent font-outfit tracking-wide text-md'>{currentMovie?.tags.join(", ")}</p>
                    </div>
                </div>
                <div className='row-span-6'>
                    <img src={currentMovie?.poster?.large} alt="movie poster" className='mobile-hero-img w-full h-full object-cover border-t-6 border-b-6 border-accent' />
                </div>
                <div className='row-span-1 flex justify-start items-center pl-4'>
                    <h1 className='mobile-title font-bold uppercase text-2xl font-outfit tracking-wide text-accent'>{currentMovie?.title || "Unknown"}</h1>
                </div>
                <div className='row-span-2 flex justify-start items-start pl-4'>
                    <p className='mobile-desc text-accent tracking-wider font-medium sm:max-w-100 md:max-w-200 font-poppins'>
                        {currentMovie?.description || "No description"}
                    </p>
                </div>
                <div className='mobile-controls row-span-1 grid grid-cols-3 z-10'>
                    <div className='bg-bg'>
                        <button onClick={handlePrev} className='w-full h-full flex justify-center items-center'>
                            <ChevronLeft className='text-accent text-2xl font-bold h-12 w-12' />
                        </button>
                    </div>
                    <div className='bg-menu'>
                        <button onClick={handleMenu} className='w-full h-full flex justify-center items-center'>
                            {
                                menuVisible ? <X className='text-accent text-2xl font-bold h-12 w-12' /> : <MenuIcon className='text-accent text-2xl font-bold h-12 w-12' />
                            }
                        </button>
                    </div>
                    <div className='bg-btn'>
                        <button onClick={handleNext} className='w-full h-full flex justify-center items-center'>
                            <ChevronRight className='text-accent h-12 w-12' />
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Home