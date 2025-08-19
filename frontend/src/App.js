import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./redux/store";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import EmailVerification from "./pages/auth/EmailVerification";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"


import Hero from "../src/components/landing/Hero"
import Features from "../src/components/landing/Features"
import About from "../src/components/landing/About"
import HowItWorks from "../src/components/landing/HowItWorks"
import Testimonials from "../src/components/landing/Testimonials"
import Pricing from "../src/components/landing/Pricing"
import Contact from "../src/components/landing/Contact"



const Dashboard = () => (
  <div className="min-h-screen bg-bg-main p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-text-dark mb-6">Passenger Dashboard</h1>
      <p className="text-text-secondary">Welcome to your passenger dashboard!</p>
    </div>
  </div>
);

const DriverDashboard = () => (
  <div className="min-h-screen bg-bg-main p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-text-dark mb-6">Driver Dashboard</h1>
      <p className="text-text-secondary">Welcome to your driver dashboard!</p>
    </div>
  </div>
);

function App() {

  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  

  console.log('Environment variables:', {
    REACT_APP_GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    finalClientId: googleClientId
  });

 
  if (!googleClientId) {
    console.error('Google Client ID is missing! Please set REACT_APP_GOOGLE_CLIENT_ID in your .env file');
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="max-w-md mx-auto text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-red-500 mb-4">
            Google OAuth Client ID is missing. Please check your environment configuration.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg text-left text-sm">
            <p className="font-semibold mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Create a <code>.env</code> file in the frontend directory</li>
              <li>Add: <code>REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here</code></li>
              <li>Restart your development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <Router>
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<LandingPage section="about" />} />
            <Route path="/how-it-works" element={<LandingPage section="how-it-works" />} />
            <Route path="/pricing" element={<LandingPage section="pricing" />} />
            <Route path="/contact" element={<LandingPage section="contact" />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/verify-email/:token" element={<EmailVerification />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/driver/dashboard" 
              element={
                <ProtectedRoute>
                  <DriverDashboard />
                </ProtectedRoute>
              } 
            />
            {/* 404 */}
            <Route path="*" element={<div>Home or 404</div>} />
          </Routes>
          <Footer />
        </Router>
      </Provider>
    </GoogleOAuthProvider>
  );
}
const LandingPage = ({ section }) => {
  // Scroll to section when provided via route
  React.useEffect(() => {
    if (section) {
      const el = document.getElementById(section)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }, [section])

  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <About />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <section id="contact"><Contact /></section>
    </div>
  )
}

export default App;
