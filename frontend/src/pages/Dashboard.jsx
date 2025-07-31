"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Car, Clock, MapPin, CreditCard, Star, TrendingUp, Calendar, User } from "lucide-react"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Loading from "../components/ui/Loading"
import RideCard from "../components/ride/RideCard"
import { useAuth } from "../hooks/useAuth"
import { useRide } from "../hooks/useRide"
import { formatCurrency } from "../utils/helpers"

const Dashboard = () => {
  const { user } = useAuth()
  const { rides, loading, getUserRides } = useRide()
  const [stats, setStats] = useState({
    totalRides: 0,
    totalSpent: 0,
    averageRating: 0,
    favoriteDestination: "N/A",
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      await getUserRides({ limit: 5 })
      // Calculate stats from rides
      calculateStats()
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    }
  }

  const calculateStats = () => {
    if (rides.length === 0) return

    const completedRides = rides.filter((ride) => ride.status === "completed")
    const totalSpent = completedRides.reduce((sum, ride) => sum + ride.price.total, 0)
    const ratingsSum = completedRides.reduce((sum, ride) => sum + (ride.rating?.passenger?.value || 0), 0)
    const averageRating = ratingsSum / completedRides.length || 0

    // Find most frequent destination
    const destinations = completedRides.map((ride) => ride.destination.address)
    const destinationCounts = destinations.reduce((acc, dest) => {
      acc[dest] = (acc[dest] || 0) + 1
      return acc
    }, {})
    const favoriteDestination = Object.keys(destinationCounts).reduce(
      (a, b) => (destinationCounts[a] > destinationCounts[b] ? a : b),
      "N/A",
    )

    setStats({
      totalRides: completedRides.length,
      totalSpent,
      averageRating: Math.round(averageRating * 10) / 10,
      favoriteDestination,
    })
  }

  const quickActions = [
    {
      title: "Book a Ride",
      description: "Request a ride to your destination",
      icon: Car,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      link: "/rides/request",
    },
    {
      title: "Ride History",
      description: "View your past rides",
      icon: Clock,
      color: "text-green-500",
      bgColor: "bg-green-50",
      link: "/rides/history",
    },
    {
      title: "Saved Places",
      description: "Manage your favorite locations",
      icon: MapPin,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      link: "/places",
    },
    {
      title: "Payment Methods",
      description: "Manage your payment options",
      icon: CreditCard,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      link: "/payment",
    },
  ]

  const statCards = [
    {
      title: "Total Rides",
      value: stats.totalRides,
      icon: Car,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Spent",
      value: formatCurrency(stats.totalSpent),
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Average Rating",
      value: stats.averageRating > 0 ? `${stats.averageRating} ★` : "N/A",
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "This Month",
      value: new Date().toLocaleDateString("en-US", { month: "long" }),
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ]

  if (loading && rides.length === 0) {
    return <Loading text="Loading your dashboard..." fullScreen />
  }

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">Welcome back, {user?.firstName}! 👋</h1>
          <p className="text-text-secondary">Here's what's happening with your rides today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-text-dark">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-text-dark mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.link}>
                  <Card className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer" hover>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center`}>
                        <action.icon className={`w-6 h-6 ${action.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-dark">{action.title}</h3>
                        <p className="text-sm text-text-secondary">{action.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Rides */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-text-dark">Recent Rides</h2>
              <Link to="/rides/history">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {rides.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="w-16 h-16 bg-bg-main rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="w-8 h-8 text-placeholder-text" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-dark mb-2">No rides yet</h3>
                  <p className="text-text-secondary mb-4">Ready to take your first ride with us?</p>
                  <Link to="/rides/request">
                    <Button>Book Your First Ride</Button>
                  </Link>
                </Card>
              ) : (
                rides
                  .slice(0, 3)
                  .map((ride) => (
                    <RideCard
                      key={ride._id}
                      ride={ride}
                      showActions={false}
                      onViewDetails={(ride) => console.log("View details:", ride)}
                    />
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        {(!user?.profilePicture || !user?.phone) && (
          <Card className="p-6 mt-8 border-l-4 border-l-primary">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-dark">Complete Your Profile</h3>
                <p className="text-sm text-text-secondary">
                  Add a profile picture and verify your phone number for a better experience.
                </p>
              </div>
              <Link to="/profile">
                <Button variant="outline" size="sm" className="bg-transparent">
                  Complete Profile
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Dashboard
