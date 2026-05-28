import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from "react-hot-toast"
import { useDispatch } from 'react-redux'
import { getCurrentUser } from './api/auth'
import { login, logout } from './store/authSlice'
import { Loader } from './components'

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res && res.data) {
          dispatch(login(res.data))
        } else {
          dispatch(logout())
        }
      })
      .catch(() => {
        dispatch(logout())
      })
      .finally(() => {
        setLoading(false)
      })
  }, [dispatch])

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#FFEBB8]">
        <Loader size={60} color="border-[#4E361E]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFEBB8] text-[#4E361E] font-poppins selection:bg-[#FFD059] selection:text-[#4E361E]">
      <Outlet />
      <Toaster position="top-center" />
    </div>
  )
}

export default App