"use client"

import { useState, useEffect } from "react"
import { Car, DollarSign, Clock, Star, TrendingUp, Users, MapPin, ToggleLeft, ToggleRight } from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { useAuth } from "../../hooks/useAuth"
import { useSelector, useDispatch } from "react-redux"
import { toggleOnlineStatus } from "../../redux/slices/driverSlice"
import { formatCurrency } from "../../utils/helpers"

const DriverDashboard = () => {
  const { user } = useAuth()
  const dispatch = useDispatch()
  const { isOnline, earnings, stats, currentRide } = useSelector((state) => state.driver)
  const [todayStats, setTodayStats] = useState({
    ridesCompleted: 0,
    hoursOnline: 0,
    earnings: 0,
    rating: 0,
  })

  useEffect(() => {
    // Load driver stats
    loadDriverStats()
  }, [])

  const loadDriverStats = async () => {
    // Simulate loading driver stats
    setTodayStats({
      ridesCompleted: 12,
      hoursOnline: 8.5,
      earnings: 245.5,
      rating: 4.8,
    })
  }

  const handleToggleOnline = () => {
    dispatch(toggleOnlineStatus())
  }

  const statCards = [
    {
      title: "Today's Earnings",
      value: formatCurrency(todayStats.earnings),
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-50",
      change: "+12%",
    },
    {
      title: "Rides Completed",
      value: todayStats.ridesCompleted,
      icon: Car,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      change: "+3",
    },
    {
      title: "Hours Online",
      value: `${todayStats.hoursOnline}h`,
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      change: "Normal",
    },
    {
      title: "Rating",
      value: `${todayStats.rating} ★`,
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      change: "Excellent",
    },
  ]

  const weeklyEarnings = [
    { day: "Mon", amount: 180 },
    { day: "Tue", amount: 220 },
    { day: "Wed", amount: 195 },
    { day: "Thu", amount: 240 },
    { day: "Fri", amount: 280 },
    { day: "Sat", amount: 320 },
    { day: "Sun", amount: 245 },
  ]

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-dark mb-2">Good morning, {user?.firstName}! 🚗</h1>
            <p className="text-text-secondary">Ready to start earning today?</p>
          </div>

          {/* Online/Offline Toggle */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-semibold text-text-dark">{isOnline ? "You're Online" : "You're Offline"}</div>
                <div className="text-sm text-text-secondary">
                  {isOnline ? "Ready to accept rides" : "Not accepting rides"}
                </div>
              </div>
              <button
                onClick={handleToggleOnline}
                className={`p-2 rounded-full transition-colors ${
                  isOnline ? "text-green-500 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"
                }`}
              >
                {isOnline ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>
          </Card>
        </div>

        {/* Current Ride Alert */}
        {currentRide && (
          <Card className="p-6 mb-8 border-l-4 border-l-primary">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-text-dark mb-1">Active Ride</h3>
                <p className="text-text-secondary">
                  Pickup: {currentRide.pickup?.address} → {currentRide.destination?.address}
                </p>
              </div>
              <Button>View Details</Button>
            </div>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-text-dark">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Earnings Chart */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-text-dark mb-6">Weekly Earnings</h2>
              <div className="space-y-4">
                {weeklyEarnings.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium text-text-secondary">{day.day}</div>
                    <div className="flex-1 bg-bg-main rounded-full h-3 relative">
                      <div
                        className="bg-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(day.amount / 320) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-20 text-right font-semibold text-text-dark">{formatCurrency(day.amount)}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-text-dark mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" hover>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">Available Rides</h3>
                    <p className="text-sm text-text-secondary">View nearby ride requests</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" hover>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">Earnings Report</h3>
                    <p className="text-sm text-text-secondary">View detailed earnings</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" hover>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">Ride History</h3>
                    <p className="text-sm text-text-secondary">View completed rides</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" hover>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">Heat Map</h3>
                    <p className="text-sm text-text-secondary">Find busy areas</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Driver Tips */}
            <Card className="p-6 mt-6 bg-gradient-to-br from-primary to-text-secondary text-white">
              <h3 className="font-semibold mb-2">💡 Driver Tip</h3>
              <p className="text-sm opacity-90">
                Peak hours are 7-9 AM and 5-7 PM. Position yourself near business districts during these times for more
                ride requests.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverDashboard
