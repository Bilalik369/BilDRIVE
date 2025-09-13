import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
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
import BackToTop from "./components/ui/BackToTop"
import ToastContainer from "./components/ui/ToastContainer"


import Hero from "../src/components/landing/Hero"
import About from "../src/components/landing/About"
import HowItWorks from "../src/components/landing/HowItWorks"
import Pricing from "../src/components/landing/Pricing"
import Contact from "../src/components/landing/Contact"



// Ride feature pages
import RideRequestPage from "./pages/ride/RideRequestPage"
import RideDetailsPage from "./pages/ride/RideDetailsPage"
import RideHistoryPage from "./pages/ride/RideHistoryPage"
import RideTrackingPage from "./pages/ride/RideTrackingPage"
import RideRatingPage from "./pages/ride/RideRatingPage"
import RideScheduledPage from "./pages/ride/RideScheduledPage"
import RideDashboard from "./pages/ride/RideDashboard"
import DriverDashboard from "./pages/driver/DriverDashboard"
import DriverAvailabilityPage from "./pages/driver/DriverAvailabilityPage"
import DriverEarningsPage from "./pages/driver/DriverEarningsPage"
import DriverProfilePage from "./pages/driver/DriverProfilePage"
import DriverRideDetailsPage from "./pages/driver/DriverRideDetailsPage"
import DriverRideRequestsPage from "./pages/driver/DriverRideRequestsPage"




function App() {

  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  

  console.log('Environment variables:', {
    REACT_APP_GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    finalClientId: googleClientId
  });

 
  if (!googleClientId) {
    console.warn('Google Client ID is missing! Google login will show a custom button.');
  }

  const AppContent = () => (
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
                  <RideDashboard />
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
            <Route 
              path="/driver/availability" 
              element={
                <ProtectedRoute>
                  <DriverAvailabilityPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/driver/earnings" 
              element={
                <ProtectedRoute>
                  <DriverEarningsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/driver/profile" 
              element={
                <ProtectedRoute>
                  <DriverProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/driver/rides/:rideId"
              element={
                <ProtectedRoute>
                  <DriverRideDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/ride-details/:rideId"
              element={
                <ProtectedRoute>
                  <DriverRideDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/requests"
              element={
                <ProtectedRoute>
                  <DriverRideRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/ride-requests"
              element={
                <ProtectedRoute>
                  <DriverRideRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/driver" element={<Navigate to="/driver/dashboard" replace />} />
           
            <Route 
              path="/ride/request" 
              element={
                <ProtectedRoute>
                  <RideRequestPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ride/history" 
              element={
                <ProtectedRoute>
                  <RideHistoryPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ride/scheduled" 
              element={
                <ProtectedRoute>
                  <RideScheduledPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ride/details/:rideId" 
              element={
                <ProtectedRoute>
                  <RideDetailsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ride/tracking/:rideId" 
              element={
                <ProtectedRoute>
                  <RideTrackingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ride/rating/:rideId" 
              element={
                <ProtectedRoute>
                  <RideRatingPage />
                </ProtectedRoute>
              } 
            />
            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-screen bg-bg-main flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-text-dark mb-4">404</h1>
                  <p className="text-text-secondary mb-6">Page non trouvée</p>
                  <Link to="/" className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90">
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            } />
          </Routes>
          <Footer />
          <BackToTop />
          <ToastContainer />
        </Router>
      </Provider>
    );


  if (googleClientId) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <AppContent />
      </GoogleOAuthProvider>
    );
  }

  return <AppContent />;
}
const LandingPage = ({ section }) => {
 
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
      <About />
      <HowItWorks />
      <Pricing />
      <section id="contact"><Contact /></section>
    </div>
  )
}

export default App;
