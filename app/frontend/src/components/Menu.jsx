import React from 'react';
import { X, Home, Compass, Bookmark, User as UserIcon, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { logout as logoutAPI } from '../api/auth';
import { logout as logoutRedux } from '../store/authSlice';

function Menu({ isMenu, setToggleMenu }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { status: isLoggedIn, userData } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        const loadingToast = toast.loading("Logging out...");
        try {
            await logoutAPI();
            dispatch(logoutRedux());
            toast.success("Logged out successfully!", { id: loadingToast });
            setToggleMenu(false);
            navigate("/login");
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to log out.", { id: loadingToast });
        }
    };

    const handleNav = (path) => {
        setToggleMenu(false);
        navigate(path);
    };

    return (
        <div
            className={`z-50 fixed top-0 right-0 w-full md:w-[400px] h-full border-l-4 border-[#4E361E] bg-[#FFEBB8] shadow-[-8px_0px_0px_0px_#4E361E] transition-all duration-300 transform ${
                isMenu ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <div className='w-full h-full flex flex-col p-6 text-[#4E361E]'>
                {/* Header: Close Button */}
                <div className='flex justify-between items-center pb-6 border-b-4 border-[#4E361E]'>
                    <div className='flex items-center gap-3'>
                        {isLoggedIn && userData && (
                            <div className='flex items-center gap-2'>
                                <div className='w-10 h-10 rounded-full border-2 border-[#4E361E] overflow-hidden bg-white shadow-[2px_2px_0px_0px_#4E361E]'>
                                    {userData.avatar ? (
                                        <img src={userData.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[#FFD059] font-bold">
                                            {userData.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <span className='font-bold font-outfit uppercase text-sm tracking-wide'>{userData.username}</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setToggleMenu(false)}
                        className='bg-[#FFD059] hover:bg-[#F5C23E] border-2 border-[#4E361E] rounded-md p-1 shadow-[2px_2px_0px_0px_#4E361E] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer'
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className='flex-grow py-8'>
                    <ul className='space-y-4'>
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <button
                                        onClick={() => handleNav("/home")}
                                        className='w-full text-left font-bold font-outfit uppercase text-xl py-3 px-4 border-2 border-transparent hover:border-[#4E361E] hover:bg-[#FFD059] rounded-md transition-all duration-100 flex items-center gap-3 cursor-pointer'
                                    >
                                        <Home size={20} /> Home
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleNav("/explore")}
                                        className='w-full text-left font-bold font-outfit uppercase text-xl py-3 px-4 border-2 border-transparent hover:border-[#4E361E] hover:bg-[#FFD059] rounded-md transition-all duration-100 flex items-center gap-3 cursor-pointer'
                                    >
                                        <Compass size={20} /> Explore
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleNav("/watchlist")}
                                        className='w-full text-left font-bold font-outfit uppercase text-xl py-3 px-4 border-2 border-transparent hover:border-[#4E361E] hover:bg-[#FFD059] rounded-md transition-all duration-100 flex items-center gap-3 cursor-pointer'
                                    >
                                        <Bookmark size={20} /> Watchlist
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleNav("/profile")}
                                        className='w-full text-left font-bold font-outfit uppercase text-xl py-3 px-4 border-2 border-transparent hover:border-[#4E361E] hover:bg-[#FFD059] rounded-md transition-all duration-100 flex items-center gap-3 cursor-pointer'
                                    >
                                        <UserIcon size={20} /> Profile
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <button
                                        onClick={() => handleNav("/login")}
                                        className='w-full text-left font-bold font-outfit uppercase text-xl py-3 px-4 border-2 border-transparent hover:border-[#4E361E] hover:bg-[#FFD059] rounded-md transition-all duration-100 flex items-center gap-3 cursor-pointer'
                                    >
                                        Sign In
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleNav("/register")}
                                        className='w-full text-left font-bold font-outfit uppercase text-xl py-3 px-4 border-2 border-transparent hover:border-[#4E361E] hover:bg-[#FFD059] rounded-md transition-all duration-100 flex items-center gap-3 cursor-pointer'
                                    >
                                        Register
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Footer Action: Logout */}
                {isLoggedIn && (
                    <div className='pt-6 border-t-4 border-[#4E361E]'>
                        <button
                            onClick={handleLogout}
                            className='w-full bg-[#4E361E] hover:bg-[#4E361E]/90 text-white font-bold font-outfit uppercase text-lg h-12 rounded-md shadow-[4px_4px_0px_0px_#FFD059] hover:shadow-[2px_2px_0px_0px_#FFD059] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 flex items-center justify-center gap-2 cursor-pointer'
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Menu;