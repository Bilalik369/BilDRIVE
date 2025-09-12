"use client"

import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout, getCurrentUser } from "../redux/slices/authSlice"
import { useEffect } from "react"

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUser())
    }
  }, [token, user, dispatch])

  const handleLogout = () => {
    dispatch(logout())
    window.showToast?.success("Logged out successfully! See you soon!")
    navigate("/")
  }

  const requireAuth = () => {
    if (!isAuthenticated) {
      navigate("/auth/login")
      return false
    }
    return true
  }

  const requireRole = (role) => {
    if (!isAuthenticated || user?.role !== role) {
      navigate("/")
      return false
    }
    return true
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    logout: handleLogout,
    requireAuth,
    requireRole,
  }
}
