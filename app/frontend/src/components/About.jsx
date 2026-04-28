import React from 'react'
import { Link } from 'react-router-dom'

function About() {
    return (
        <div className='w-screen h-screen overflow-hidden'>
            <div className='w-full h-full bg-primary flex justify-center items-center flex-col'>
                <p className='text-accent text-2xl font-outfit font-bold'>Coming Soon....</p>
                <Link to="/home" className="text-accent underline text-sm font-bold font-poppins tracking-wider">Go back to Home</Link>
            </div>
        </div>
    )
}

export default About