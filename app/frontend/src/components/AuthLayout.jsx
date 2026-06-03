import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Protected({ children, authentication = true, adminOnly = false }) {
    const navigate = useNavigate()
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        if (authentication && authStatus !== authentication) {
            navigate('/login')
        } else if (!authentication && authStatus !== authentication) {
            navigate('/home')
        } else if (authentication && adminOnly && userData?.role !== "admin") {
            navigate('/home')
        }
    }, [authStatus, userData, navigate, authentication, adminOnly])
    return <>{children}</>
}

export default Protected