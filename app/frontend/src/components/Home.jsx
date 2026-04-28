import React, { useRef, useState } from 'react'
import smallLogo from "../assets/smallLogo.png"
import largeLogo from "../assets/largeLogo.png"
import largeBg from "../assets/mainBg.png"
import overlayBg from "../assets/overlay_bg.png"
import { Link } from "react-router-dom"
import { Menu, X, ChevronLeft, ChevronRight, FastForward } from "lucide-react";

import suzume from "../assets/SUZUME.jpg"
import yourName from "../assets/yourname.jpg"
import gardenofwords from "../assets/gardenofwords.jpg"
import jujutsuKaisen from "../assets/jujutsu_kaisen.jpg"

import { useGSAP } from "@gsap/react"
import gsap from 'gsap'

function Home() {
    const [menuVisible, setMenuVisible] = useState(false)
    const mainContainerRef = useRef()

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

    return (
        <div ref={mainContainerRef} className='w-screen h-screen overflow-hidden relative'>

            <img src={overlayBg} alt="overlay" className='absolute bottom-0 left-0 hidden lg:flex xl:flex z-1' />

            {/* Large screens */}
            <div className='hidden sm:hidden md:hidden lg:grid xl:grid grid-cols-16 w-full h-full bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(${largeBg})` }}>
                <div className='col-span-1'></div>
                <div className='col-span-5 grid lg:grid-rows-8 xl:grid-rows-12 z-10'>
                    <div className='lg:row-span-1 xl:row-span-1 flex justify-start items-center'>
                        <img src={largeLogo} alt="logo" className='object-cover max-w-60' />
                    </div>
                    <div className='lg:row-span-1 xl:row-span-2'></div>
                    <div className='row-span-1 grid grid-cols-4'>
                        <p className='year font-bold font-outfit text-4xl text-white tracking-wide col-span-1 text-start content-center'>2012</p>
                        <p className='genre font-medium font-outfit text-xl text-white tracking-wider col-span-2 xl:text-start lg:text-center  content-center'>Action</p>
                    </div>
                    <div className='row-span-1 flex justify-start items-start'>
                        <h1 className='hero-title uppercase text-4xl font-outfit font-extrabold text-white tracking-tighter shrink max-w-sm'>Demon slayer mugen train arc</h1>
                    </div>
                    <div className='lg:row-span-2 xl:row-span-4 flex justify-start items-start pt-6'>
                        <p className='hero-desc text-white font-poppins text-sm tracking-widest font-medium lg:max-w-80 xl:max-w-md'>After his family was brutally murdered and his sister turned into a demon, Tanjiro Kamado's journey as a demon slayer began. Tanjiro and his comrades embark on a new mission aboard the Mugen Train, on track to despair.</p>
                    </div>
                    <div className='row-span-1'></div>
                    <div className='lg:row-span-1 xl:row-span-2 flex justify-start items-start gap-2 flex-wrap'>
                        {["Adventure", "Action", "Sowrdsman", "Courage"].map((value, index) => (
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
                        {["Login", "Register"].map((value, index) => (
                            <Link to={`/${value.toLowerCase()}`} key={index} className='nav-item col-span-1 text-white font-medium font-poppins text-2xl cursor-pointer hover:underline uppercase tracking-wider text-center content-center '>{value}</Link>
                        ))}
                    </div>
                </div>
                <div className='col-span-4'>
                    <div className='inset-0 backdrop-blur-md bg-white/1 w-full h-full flex flex-col lg:justify-center xl:justify-start items-center p-6 gap-8'>
                        <div className='card border-2 border-white lg:w-60 xl:w-80 shadow-[8px_12px_0px_0px_#ffffff] cursor-pointer relative'>
                            <img src={yourName} className='object-cover w-full h-full' alt="your name" />
                            <p className='absolute top-0 right-2 font-bold uppercase text-white'>Your Name</p>
                        </div>
                        <div className='card border-2 border-white lg:w-60 xl:w-80 shadow-[8px_12px_0px_0px_#ffffff] cursor-pointer relative'>
                            <img src={suzume} className='object-cover w-full h-full' alt="suzume" />
                            <p className='absolute top-0 right-2 font-bold uppercase text-white'>suzume</p>
                        </div>
                        <div className='card border-2 border-white lg:w-60 xl:w-80 shadow-[8px_12px_0px_0px_#ffffff] cursor-pointer relative'>
                            <img src={gardenofwords} className='object-cover w-full h-full' alt="graden of words" />
                            <p className='absolute top-0 right-2 font-bold uppercase text-white'>garden of words</p>
                        </div>
                        <div className='card border-2 border-white lg:w-60 xl:w-80 shadow-[8px_12px_0px_0px_#ffffff] cursor-pointer relative'>
                            <img src={jujutsuKaisen} className='object-cover w-full h-full' alt="jujutsu kaisen" />
                            <p className='absolute top-0 right-2 font-bold uppercase text-white'>Jujutsu kaisen</p>
                        </div>
                    </div>
                </div>
                <div className='col-span-1'></div>
            </div>


            {/* for smaller screens */}
            <div className="w-full h-full grid grid-rows-12 bg-primary lg:hidden relative">
                <div className={`mobile-menu w-full h-full grid grid-rows-8 bg-primary absolute transition-all z-1 ${menuVisible ? "flex" : "hidden"}`}>
                    {["Home", "About", "Submission", "Lists"].map((value, index) => (
                        <Link to={`/${value.toLowerCase()}`} key={index} className='mobile-link row-span-1 px-8 content-center text-xl font-poppins tracking-wider uppercase font-bold border-b-2 cursor-pointer active:bg-accent active:text-white'>{value}</Link>
                    ))}
                    <div className='row-span-2 flex justify-around items-center gap-10'>
                        {["Login", "Register"].map((value, index) => (
                            <Link to={`/${value.toLowerCase()}`} key={index} className='text-xl bg-accent text-white font-poppins font-medium tracking-wider px-8 py-4 rounded-md active:bg-bg active:text-black'>{value}</Link>
                        ))}
                    </div>
                </div>
                <div className='row-span-2 grid grid-rows-2'>
                    <div className='grid grid-cols-2'>
                        <div className='col-span-1 flex justify-center px-4 flex-col'>
                            <h2 className='mobile-year text-2xl font-extrabold font-outfit text-accent tracking-wide'>2016</h2>
                            <p className='mobile-genre text-md font-bold font-outfit tracking-widest text-accent'>Romance</p>
                        </div>
                        <div className='col-span-1 uppercase font-outfit font-bold flex justify-end items-center pr-10'>
                            <img src={smallLogo} alt='logo' />
                        </div>
                    </div>
                    <div className='flex justify-start items-center pl-4'>
                        <p className='mobile-tag font-bold text-accent font-outfit tracking-wide text-md'>Magical, Teenage, High School</p>
                    </div>
                </div>
                <div className='row-span-6'>
                    <img src={yourName} alt="movie poster" className='mobile-hero-img w-full h-full object-cover border-t-6 border-b-6 border-accent' />
                </div>
                <div className='row-span-1 flex justify-start items-center pl-4'>
                    <h1 className='mobile-title font-bold uppercase text-2xl font-outfit tracking-wide text-accent'>Your Name</h1>
                </div>
                <div className='row-span-2 flex justify-start items-start pl-4'>
                    <p className='mobile-desc text-accent tracking-wider font-medium sm:max-w-100 md:max-w-200 font-poppins'>
                        Two teenagers share a profound, magical connection upon discovering they are swapping bodies. Things manage to become even more complicated when the boy and girl decide to meet in person.
                    </p>
                </div>
                <div className='mobile-controls row-span-1 grid grid-cols-3 z-10'>
                    <div className='bg-bg'>
                        <button className='w-full h-full flex justify-center items-center'>
                            <ChevronLeft className='text-accent text-2xl font-bold h-12 w-12' />
                        </button>
                    </div>
                    <div className='bg-menu'>
                        <button onClick={handleMenu} className='w-full h-full flex justify-center items-center'>
                            {
                                menuVisible ? <X className='text-accent text-2xl font-bold h-12 w-12' /> : <Menu className='text-accent text-2xl font-bold h-12 w-12' />
                            }
                        </button>
                    </div>
                    <div className='bg-btn'>
                        <button className='w-full h-full flex justify-center items-center'>
                            <ChevronRight className='text-accent h-12 w-12' />
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Home