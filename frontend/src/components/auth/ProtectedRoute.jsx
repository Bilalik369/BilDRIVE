import React from "react"
import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import { toast } from "react-hot-toast"

const ProtectedRoute = ({ children, requireVerification = true }) => {
  const { isAuthenticated, isEmailVerified, user } = useSelector((state) => state.auth)
  const location = useLocation()


  if (!isAuthenticated) {
    toast.error("Please log in to access this page")
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (requireVerification && !isEmailVerified) {
    toast.error("Please verify your email before accessing this page")
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

 
  if (user?.role === "driver" && location.pathname.startsWith("/dashboard")) {
    return <Navigate to="/driver/dashboard" replace />
  }

  
  if (user?.role === "passenger" && location.pathname.startsWith("/driver")) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute 