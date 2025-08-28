"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Car,
  DollarSign,
  Clock,
  Star,
  TrendingUp,
  Users,
  MapPin,
  ToggleLeft,
  ToggleRight,
  Navigation,
  Battery,
  Wifi,
  Bell,
} from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { useAuth } from "../../hooks/useAuth"
import { useSelector, useDispatch } from "react-redux"
import { toggleOnlineStatus } from "../../redux/slices/driverSlice"
import { formatCurrency } from "../../utils/helpers"

const DriverDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isOnline, earnings, stats, currentRide } = useSelector((state) => state.driver)
  const [todayStats, setTodayStats] = useState({
    ridesCompleted: 0,
    hoursOnline: 0,
    earnings: 0,
    rating: 0,
  })
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    loadDriverStats()
    return () => clearInterval(timer)
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
      title: "Gains du jour",
      value: formatCurrency(todayStats.earnings),
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-50",
      change: "+12%",
      changeColor: "text-green-600",
    },
    {
      title: "Courses terminées",
      value: todayStats.ridesCompleted,
      icon: Car,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      change: "+3 aujourd'hui",
      changeColor: "text-blue-600",
    },
    {
      title: "Heures en ligne",
      value: `${todayStats.hoursOnline}h`,
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      change: "Normal",
      changeColor: "text-purple-600",
    },
    {
      title: "Note moyenne",
      value: `${todayStats.rating} ★`,
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      change: "Excellent",
      changeColor: "text-yellow-600",
    },
  ]

  const weeklyEarnings = [
    { day: "Lun", amount: 180, rides: 8 },
    { day: "Mar", amount: 220, rides: 12 },
    { day: "Mer", amount: 195, rides: 9 },
    { day: "Jeu", amount: 240, rides: 14 },
    { day: "Ven", amount: 280, rides: 16 },
    { day: "Sam", amount: 320, rides: 18 },
    { day: "Dim", amount: 245, rides: 13 },
  ]

  const quickActions = [
    {
      title: "Courses disponibles",
      description: "Voir les demandes à proximité",
      icon: Car,
      color: "blue",
      action: () => navigate("/driver/requests"),
    },
    {
      title: "Rapport de gains",
      description: "Consulter les gains détaillés",
      icon: TrendingUp,
      color: "green",
      action: () => navigate("/driver/earnings"),
    },
    {
      title: "Historique",
      description: "Voir les courses terminées",
      icon: Users,
      color: "purple",
      action: () => navigate("/ride/history"),
    },
    {
      title: "Zones actives",
      description: "Trouver les zones de forte demande",
      icon: MapPin,
      color: "orange",
      action: () => navigate("/driver/availability"),
    },
  ]

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Bonjour"
    if (hour < 18) return "Bon après-midi"
    return "Bonsoir"
  }

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-dark mb-2">
              {getGreeting()}, {user?.firstName}! 🚗
            </h1>
            <p className="text-text-secondary">
              {isOnline
                ? "Vous êtes en ligne et prêt à accepter des courses"
                : "Passez en ligne pour commencer à gagner"}
            </p>
          </div>

          {/* Status and Controls */}
          <div className="flex items-center gap-4">
            {/* Connection indicators */}
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Wifi className="w-4 h-4 text-green-500" />
              <Battery className="w-4 h-4 text-green-500" />
              <Bell className="w-4 h-4" />
            </div>

            {/* Online/Offline Toggle */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className={`font-semibold ${isOnline ? "text-green-600" : "text-gray-600"}`}>
                    {isOnline ? "En ligne" : "Hors ligne"}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {isOnline ? "Accepte les courses" : "N'accepte pas les courses"}
                  </div>
                </div>
                <button
                  onClick={handleToggleOnline}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isOnline ? "text-green-500 hover:bg-green-50 bg-green-50" : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {isOnline ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Current Ride Alert */}
        {currentRide && (
          <Card className="p-6 mb-8 border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-dark mb-1">Course active</h3>
                  <p className="text-text-secondary">
                    De {currentRide.pickup?.address} → {currentRide.destination?.address}
                  </p>
                </div>
              </div>
              <Button onClick={() => navigate(`/driver/rides/${currentRide.id}`)}>Voir les détails</Button>
            </div>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-sm font-medium ${stat.changeColor}`}>{stat.change}</span>
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-dark">Gains de la semaine</h2>
                <div className="text-sm text-text-secondary">
                  Total: {formatCurrency(weeklyEarnings.reduce((sum, day) => sum + day.amount, 0))}
                </div>
              </div>
              <div className="space-y-4">
                {weeklyEarnings.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium text-text-secondary">{day.day}</div>
                    <div className="flex-1 bg-bg-main rounded-full h-4 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-text-secondary h-4 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(day.amount / 320) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-20 text-right">
                      <div className="font-semibold text-text-dark">{formatCurrency(day.amount)}</div>
                      <div className="text-xs text-text-secondary">{day.rides} courses</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-text-dark mb-6">Actions rapides</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={action.action}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 bg-${action.color}-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <action.icon className={`w-6 h-6 text-${action.color}-500`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-dark group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-text-secondary">{action.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Driver Tips */}
            <Card className="p-6 mt-6 bg-gradient-to-br from-primary to-text-secondary text-white">
              <h3 className="font-semibold mb-3 flex items-center gap-2">💡 Conseil du jour</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                Les heures de pointe sont de 7h-9h et 17h-19h. Positionnez-vous près des quartiers d'affaires pendant
                ces créneaux pour maximiser vos gains.
              </p>
            </Card>

            {/* Weather/Traffic Info */}
            <Card className="p-6 mt-4">
              <h3 className="font-semibold text-text-dark mb-3">Conditions actuelles</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Météo</span>
                  <span className="text-text-dark">☀️ Ensoleillé, 22°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Trafic</span>
                  <span className="text-green-600">🟢 Fluide</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Demande</span>
                  <span className="text-orange-600">🟡 Modérée</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverDashboard
