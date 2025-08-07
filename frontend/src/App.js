import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { store } from "./redux/store";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import EmailVerification from "./pages/auth/EmailVerification";
import ProtectedRoute from "./components/auth/ProtectedRoute";


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
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/verify-email/:token" element={<EmailVerification />} />
          
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
          
        
          <Route path="/" element={<Login />} />
          <Route path="*" element={<div>Home or 404</div>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
