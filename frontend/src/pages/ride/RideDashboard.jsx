import { useState, useEffect } from "react"
import { Plus, Clock, MapPin, Car, Star, Filter, Search, TrendingUp, Users, Calendar, Navigation, ArrowRight } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
       
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Bonjour, {user?.firstName} 👋
                  </h1>
                  <p className="text-gray-600">Où souhaitez-vous aller aujourd'hui ?</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button 
                size="lg" 
                icon={<Plus className="w-5 h-5" />}
                onClick={() => navigate("/ride/request")}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
              >
                Nouvelle Course
              </Button>
              <Button 
                variant="outline"
                size="lg"
                icon={<Navigation className="w-5 h-5" />}
                onClick={() => navigate("/ride/history")}
                className="w-full sm:w-auto"
              >
                Mes Courses
              </Button>
            </div>
          </div>
        </div>

        {currentRide && (
          <Card className="mb-8 overflow-hidden border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Course en cours</h2>
                    <p className="text-sm text-gray-600">Suivez votre course en temps réel</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(currentRide.status)}`}>
                  {currentRide.status}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Départ</p>
                        <p className="font-semibold text-gray-900">{currentRide.pickup.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Destination</p>
                        <p className="font-semibold text-gray-900">{currentRide.destination.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-500 mb-1">Prix total</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {currentRide.price.total.toFixed(2)} DH
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate(`/ride/tracking/${currentRide._id}`)}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Suivre la course
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Terminées</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Annulées</p>
                <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Dépensé</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalSpent.toFixed(2)} DH</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

       
        <Card className="p-6 mb-8 border-0 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par adresse..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 min-w-[180px]"
              >
                <option value="all">Toutes les courses</option>
                <option value={RIDE_STATUS.COMPLETED}>Terminées</option>
                <option value={RIDE_STATUS.CANCELLED}>Annulées</option>
                <option value={RIDE_STATUS.SCHEDULED}>Programmées</option>
              </select>
            </div>
          </div>
        </Card>

    
        <Card className="border-0 shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Courses récentes</h2>
                <p className="text-gray-600">Vos dernières courses</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate("/ride/history")}
                icon={<ArrowRight className="w-4 h-4" />}
                className="bg-transparent"
              >
                Voir tout
              </Button>
            </div>

            {filteredRides.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Car className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-3">
                  Aucune course trouvée
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Commencez par demander votre première course et elle apparaîtra ici
                </p>
                <Button 
                  onClick={() => navigate("/ride/request")}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  icon={<Plus className="w-5 h-5" />}
                >
                  Demander une course
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRides.slice(0, 5).map((ride) => (
                  <div
                    key={ride._id}
                    className="group relative bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-orange-200 cursor-pointer transition-all duration-300 overflow-hidden"
                    onClick={() => navigate(`/ride/details/${ride._id}`)}
                  >
                   
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {ride.price.total.toFixed(2)} DH
                      </div>
                    </div>

                    <div className="p-4 pr-20">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center mt-1">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <MapPin className="w-3 h-3 text-white" />
                          </div>
                          <div className="w-px h-6 bg-gray-300 my-1"></div>
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <MapPin className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm mb-1 truncate">
                            {ride.pickup.address}
                          </div>
                          <div className="text-gray-600 text-xs mb-2 truncate">
                            {ride.destination.address}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(ride.createdAt)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                              {ride.status}
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            {ride.distance ? `${(ride.distance / 1000).toFixed(1)} km` : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card 
            className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200"
            onClick={() => navigate("/ride/scheduled")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Courses programmées</h3>
                <p className="text-gray-600 text-sm">Gérez vos courses planifiées</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200"
            onClick={() => navigate("/ride/history")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Historique complet</h3>
                <p className="text-gray-600 text-sm">Consultez toutes vos courses</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200"
            onClick={() => navigate("/profile")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Mon profil</h3>
                <p className="text-gray-600 text-sm">Gérez vos informations</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RideDashboard
