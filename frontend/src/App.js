"use client"
import { Provider } from "react-redux"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import { store } from "../src/redux/store"
import { websocketService } from "../src/utils/websocket"

// Layout components
import Navbar from "../src/components/layout/Navbar"
import Footer from "../src/components/layout/Footer"

// Landing page components
import Hero from "../src/components/landing/Hero"
import Features from "../src/components/landing/Features"
import About from "../src/components/landing/About"
import HowItWorks from "../src/components/landing/HowItWorks"
import Testimonials from "../src/components/landing/Testimonials"
import Pricing from "../src/components/landing/Pricing"

// Auth components
import LoginForm from "../src/components/auth/LoginForm"
import RegisterForm from "../src/components/auth/RegisterForm"

// Dashboard components
import Dashboard from "../src/pages/Dashboard"
import Profile from "../src/pages/Profile"
import DriverDashboard from "../src/pages/driver/DriverDashboard"

// Ride components
import RideRequestForm from "../src/components/ride/RideRequestForm"
import RideHistory from "../src/components/ride/RideHistory"
import RideTracking from "../src/components/ride/RideTracking"


// WebSocket Connection Component
const WebSocketConnection = () => {
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      websocketService.connect(token)
    }

    return () => {
      websocketService.disconnect()
    }
  }, [])

  return null
}

// Main App Component
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-white">
          <WebSocketConnection />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth/login" element={<LoginForm />} />
              <Route path="/auth/register" element={<RegisterForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/rides/request" element={<RideRequestForm />} />
              <Route path="/rides/history" element={<RideHistory />} />
              <Route path="/rides/track/:rideId" element={<RideTracking />} />
              <Route path="/driver/dashboard" element={<DriverDashboard />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/pricing" element={<Pricing />} />
            </Routes>
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                style: {
                  background: "#10B981",
                },
              },
              error: {
                style: {
                  background: "#EF4444",
                },
              },
            }}
          />
        </div>
      </Router>
    </Provider>
  )
}

// Update the Landing Page component
const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <About />
      <HowItWorks />
      <Testimonials />
      <Pricing />
    </div>
  )
}

export default App
