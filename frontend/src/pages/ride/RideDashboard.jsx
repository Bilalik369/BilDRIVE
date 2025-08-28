"use client"

import { useState, useEffect } from "react"
import { Plus, Clock, MapPin, Car, Star, Filter, Search } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Loading from "../../components/ui/Loading"
import { useRide } from "../../hooks/useRide"
import { useAuth } from "../../hooks/useAuth"
import { RIDE_STATUS } from "../../utils/constants"
import { formatCurrency, formatDate } from "../../utils/helpers"

const RideDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { rides, currentRide, loading, getUserRides } = useRide()
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    getUserRides({ limit: 10 })
  }, [])

  const filteredRides = rides.filter((ride) => {
    const matchesFilter = filter === "all" || ride.status === filter
    const matchesSearch = 
      ride.pickup.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.destination.address.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status) => {
    const colors = {
      [RIDE_STATUS.REQUESTED]: "bg-blue-100 text-blue-800",
      [RIDE_STATUS.SEARCHING]: "bg-yellow-100 text-yellow-800",
      [RIDE_STATUS.ACCEPTED]: "bg-green-100 text-green-800",
      [RIDE_STATUS.IN_PROGRESS]: "bg-purple-100 text-purple-800",
      [RIDE_STATUS.COMPLETED]: "bg-gray-100 text-gray-800",
      [RIDE_STATUS.CANCELLED]: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const stats = {
    total: rides.length,
    completed: rides.filter(r => r.status === RIDE_STATUS.COMPLETED).length,
    cancelled: rides.filter(r => r.status === RIDE_STATUS.CANCELLED).length,
    totalSpent: rides
      .filter(r => r.status === RIDE_STATUS.COMPLETED)
      .reduce((sum, r) => sum + r.price.total, 0)
  }

  if (loading) return <Loading />

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour, {user?.firstName} 👋
          </h1>
          <p className="text-gray-600">Où souhaitez-vous aller aujourd'hui ?</p>
        </div>
        <Button 
          size="lg" 
          icon={<Plus className="w-5 h-5" />}
          onClick={() => navigate("/ride/request")}
          className="mt-4 md:mt-0"
        >
          Nouvelle Course
        </Button>
      </div>

      {/* Course active */}
      {currentRide && (
        <Card className="p-6 mb-8 border-l-4 border-l-primary">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Course en cours</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentRide.status)}`}>
              {currentRide.status}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Départ</p>
                <p className="font-medium">{currentRide.pickup.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Destination</p>
                <p className="font-medium">{currentRide.destination.address}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prix</p>
                <p className="font-bold text-primary text-lg">
                  {formatCurrency(currentRide.price.total)}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate(`/ride/tracking/${currentRide._id}`)}
                className="bg-transparent"
              >
                Suivre
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">{stats.total}</div>
          <div className="text-gray-600">Total courses</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.completed}</div>
          <div className="text-gray-600">Terminées</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">{stats.cancelled}</div>
          <div className="text-gray-600">Annulées</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {formatCurrency(stats.totalSpent)}
          </div>
          <div className="text-gray-600">Total dépensé</div>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par adresse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Toutes les courses</option>
            <option value={RIDE_STATUS.COMPLETED}>Terminées</option>
            <option value={RIDE_STATUS.CANCELLED}>Annulées</option>
            <option value={RIDE_STATUS.SCHEDULED}>Programmées</option>
          </select>
        </div>
      </div>

      {/* Liste des courses récentes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Courses récentes</h2>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/ride/history")}
          >
            Voir tout
          </Button>
        </div>

        {filteredRides.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Aucune course trouvée
            </h3>
            <p className="text-gray-500 mb-6">
              Commencez par demander votre première course
            </p>
            <Button onClick={() => navigate("/ride/request")}>
              Demander une course
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRides.slice(0, 5).map((ride) => (
              <div
                key={ride._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/ride/details/${ride._id}`)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col items-center">
                    <MapPin className="w-4 h-4 text-green-500 mb-1" />
                    <div className="w-px h-6 bg-gray-300"></div>
                    <MapPin className="w-4 h-4 text-red-500 mt-1" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm mb-1">
                      {ride.pickup.address}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {ride.destination.address}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(ride.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary mb-1">
                    {formatCurrency(ride.price.total)}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                    {ride.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/ride/scheduled")}
        >
          <Clock className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="font-semibold mb-2">Courses programmées</h3>
          <p className="text-gray-600 text-sm">Gérez vos courses planifiées</p>
        </Card>
        
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/ride/history")}
        >
          <Star className="w-8 h-8 text-yellow-500 mb-4" />
          <h3 className="font-semibold mb-2">Historique complet</h3>
          <p className="text-gray-600 text-sm">Consultez toutes vos courses</p>
        </Card>
        
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/profile")}
        >
          <Car className="w-8 h-8 text-green-500 mb-4" />
          <h3 className="font-semibold mb-2">Mon profil</h3>
          <p className="text-gray-600 text-sm">Gérez vos informations</p>
        </Card>
      </div>
    </div>
  )
}

export default RideDashboard
