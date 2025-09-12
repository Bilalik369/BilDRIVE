"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Menu, X, User, Settings, LogOut, Car, Moon, Sun, Bell } from "lucide-react"
import Button from "../ui/Button"
import { logout } from "../../redux/slices/authSlice"
import { toggleTheme } from "../../redux/slices/uiSlice"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { theme } = useSelector((state) => state.ui)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    dispatch(logout())
    window.showToast?.success("Logged out successfully! See you soon!")
    navigate("/")
    setIsProfileOpen(false)
    setIsMenuOpen(false) // Close mobile menu on logout
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/how-it-works", label: "How It Works" },
    { path: "/pricing", label: "Pricing" },
    { path: "/contact", label: "Contact" },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-text-dark">Bildrive</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-secondary hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                {/* Profile dropdown */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </Button>

                  {/* Dropdown menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2 text-gray-600" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2 text-gray-600" />
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-2 text-gray-600" />
                          Settings
                        </Link>
                        <hr className="my-1 border-gray-200" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              icon={isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                    isActive(link.path)
                      ? "text-primary bg-white"
                      : "text-gray-700 hover:text-primary hover:bg-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="pt-4 space-y-2 border-t border-gray-200">
                  {/* Mobile user profile section */}
                  <div className="flex items-center px-3 py-2 space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  
                  {/* Mobile menu items */}
                  <Link
                    to="/dashboard"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-white rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-3 text-gray-600" />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-white rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-3 text-gray-600" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-white rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-3 text-gray-600" />
                    Settings
                  </Link>
                  
                  {/* Mobile logout - FIXED VISIBILITY ISSUE */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 space-y-2 border-t border-gray-200">
                  <Link to="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
