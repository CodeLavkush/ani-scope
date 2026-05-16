import React from 'react'
import { Link } from 'react-router-dom'

function About() {
    return (
        <div className='w-screen min-h-screen overflow-y-auto bg-primary flex justify-center items-center px-4 py-10'>

            <div className='w-full max-w-4xl flex flex-col items-center text-center'>

                <h1 className='text-accent text-2xl sm:text-3xl md:text-4xl font-outfit font-bold mb-4'>
                    About This App
                </h1>

                <p className='text-accent font-poppins text-sm sm:text-base md:text-lg max-w-2xl leading-6'>
                    This is a movie showcase platform where users can browse movies,
                    view details, and submit new movie entries using a structured form.
                </p>

                {/* How to submit */}
                <div className='mt-6 w-full bg-menu p-4 sm:p-6 rounded-lg shadow-lg text-left'>

                    <h2 className='text-accent font-bold text-lg sm:text-xl mb-3'>
                        How to Submit a Movie
                    </h2>

                    <ol className='list-decimal pl-5 text-accent font-poppins text-sm sm:text-base space-y-2'>

                        <li>Go to the Submission page from the navigation menu.</li>

                        <li>
                            Fill in all required fields:
                            <ul className='list-disc pl-5 mt-2 text-accent/80 space-y-1'>
                                <li>Upload a movie poster image (recommended size: 1920 × 1080)</li>
                                <li>Enter a title (max 30 characters)</li>
                                <li>Add a description (max 200 characters)</li>
                                <li>Provide release year (e.g. 2024)</li>
                                <li>Enter genre (e.g. Action, Drama)</li>
                                <li>Add tags separated by commas</li>
                            </ul>
                        </li>

                        <li>Click the <b>Add Edit</b> button to submit the form.</li>

                        <li>On success, you will see a success toast message.</li>
                    </ol>

                </div>

                {/* Example */}
                <div className='mt-6 w-full bg-primary border border-accent p-4 sm:p-6 rounded-lg text-left'>

                    <h2 className='text-accent font-bold text-lg sm:text-xl mb-3'>
                        Example Submission
                    </h2>

                    <p className='text-accent font-poppins text-sm sm:text-base leading-6'>
                        Title: <b>Inception</b><br />
                        Description: <b>A thief who steals corporate secrets through dream-sharing technology.</b><br />
                        Release Year: <b>2010</b><br />
                        Genre: <b>Sci-Fi</b><br />
                        Tags: <b>dream, mind-bending, thriller</b>
                    </p>

                </div>

                <Link
                    to="/home"
                    className='mt-6 text-accent underline text-sm sm:text-base font-bold font-poppins tracking-wider'
                >
                    Go back to Home
                </Link>

            </div>
        </div>
    )
}

export default About