import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, MapPin, Edit, Trash2, Plus, Filter } from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Loading from "../../components/ui/Loading"
import { useRide } from "../../hooks/useRide"
import { RIDE_STATUS } from "../../utils/constants"
import { formatCurrency, formatDate, formatTime } from "../../utils/helpers"
import { toast } from "react-hot-toast"
import { useSelector } from "react-redux"

const RideScheduledPage = () => {
  const navigate = useNavigate()
  const { rides, loading, getUserRides, cancelRide } = useRide()
  const [scheduledRides, setScheduledRides] = useState([])
  const [filter, setFilter] = useState("upcoming")
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedRide, setSelectedRide] = useState(null)
  const [mockRides, setMockRides] = useState([
    {
      _id: "scheduled1",
      pickup: { address: "123 Rue Mohammed V, Casablanca" },
      destination: { address: "Aéroport Mohammed V, Nouaceur" },
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Dans 2h
      vehicleType: "standard",
      passengers: 2,
      price: { total: 45 },
      status: RIDE_STATUS.SCHEDULED,
      createdAt: new Date().toISOString(),
      notes: "Vol à 14h30, merci d'être ponctuel",
    },
    {
      _id: "scheduled2",
      pickup: { address: "Gare Casa-Port" },
      destination: { address: "Twin Center, Casablanca" },
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Demain
      vehicleType: "premium",
      passengers: 1,
      price: { total: 25 },
      status: RIDE_STATUS.SCHEDULED,
      createdAt: new Date().toISOString(),
      notes: "",
    },
    {
      _id: "scheduled3",
      pickup: { address: "Hôtel Hyatt Regency" },
      destination: { address: "Marina de Casablanca" },
      scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Dans 3 jours
      vehicleType: "suv",
      passengers: 4,
      price: { total: 35 },
      status: RIDE_STATUS.SCHEDULED,
      createdAt: new Date().toISOString(),
      notes: "Famille avec enfants",
    },
  ])
  
  // Get theme from Redux store
  const { theme } = useSelector((state) => state.ui)
  const isDark = theme === 'dark'

  useEffect(() => {
    // Récupérer toutes les courses programmées
    getUserRides({ status: RIDE_STATUS.SCHEDULED, limit: 50 })
  }, [])

  useEffect(() => {
    // Filtrer les données mock selon le filtre sélectionné
    const filtered = mockRides.filter((ride) => {
      const scheduledTime = new Date(ride.scheduledTime)
      const now = new Date()

      switch (filter) {
        case "upcoming":
          return scheduledTime > now
        case "today":
          return scheduledTime.toDateString() === now.toDateString()
        case "week":
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
          return scheduledTime > now && scheduledTime <= weekFromNow
        case "all":
        default:
          return true
      }
    })

    setScheduledRides(filtered)
  }, [filter, mockRides])

  const handleCancelRide = async () => {
    if (!selectedRide) return

    try {
      // Pour les données mock, on supprime directement de la liste locale
      // Pour les vraies données, on appellerait l'API
      if (selectedRide._id.startsWith('scheduled')) {
        // Données mock - suppression locale
        setMockRides((prev) => prev.filter((ride) => ride._id !== selectedRide._id))
        toast.success("Course programmée annulée")
      } else {
        // Données réelles - appel API
        await cancelRide(selectedRide._id, "Annulation par l'utilisateur")
        setScheduledRides((prev) => prev.filter((ride) => ride._id !== selectedRide._id))
        toast.success("Course programmée annulée")
      }
      
      setShowCancelModal(false)
      setSelectedRide(null)
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error)
      toast.error("Erreur lors de l'annulation")
    }
  }

  const getTimeUntilRide = (scheduledTime) => {
    const now = new Date()
    const scheduled = new Date(scheduledTime)
    const diffMs = scheduled - now
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `Dans ${diffDays} jour${diffDays > 1 ? "s" : ""}`
    } else if (diffHours > 0) {
      return `Dans ${diffHours} heure${diffHours > 1 ? "s" : ""}`
    } else if (diffMs > 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return `Dans ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`
    } else {
      return "Maintenant"
    }
  }

  const canModify = (scheduledTime) => {
    const now = new Date()
    const scheduled = new Date(scheduledTime)
    const diffHours = (scheduled - now) / (1000 * 60 * 60)
    return diffHours > 2 // Peut modifier si plus de 2h avant
  }

  if (loading) return <Loading />

  return (
    <div className={`max-w-6xl mx-auto p-6 min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Courses programmées</h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Gérez vos courses planifiées à l'avance</p>
        </div>
        <Button
          size="lg"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => navigate("/ride/request")}
          className="mt-4 md:mt-0"
        >
          Programmer une course
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total programmées - Orange */}
        <Card className={`p-6 text-center ${isDark ? 'bg-gradient-to-br from-orange-900 to-orange-800 border-orange-700' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'}`}>
          <div className="text-3xl font-bold text-orange-500 mb-2">{scheduledRides.length}</div>
          <div className={`${isDark ? 'text-orange-200' : 'text-orange-700'}`}>Total programmées</div>
        </Card>
        
        {/* Aujourd'hui - Green */}
        <Card className={`p-6 text-center ${isDark ? 'bg-gradient-to-br from-green-900 to-green-800 border-green-700' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'}`}>
          <div className="text-3xl font-bold text-green-500 mb-2">
            {
              scheduledRides.filter((r) => {
                const scheduled = new Date(r.scheduledTime)
                const today = new Date()
                return scheduled.toDateString() === today.toDateString()
              }).length
            }
          </div>
          <div className={`${isDark ? 'text-green-200' : 'text-green-700'}`}>Aujourd'hui</div>
        </Card>
        
        {/* Cette semaine - Blue */}
        <Card className={`p-6 text-center ${isDark ? 'bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'}`}>
          <div className="text-3xl font-bold text-blue-500 mb-2">
            {
              scheduledRides.filter((r) => {
                const scheduled = new Date(r.scheduledTime)
                const now = new Date()
                const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                return scheduled > now && scheduled <= weekFromNow
              }).length
            }
          </div>
          <div className={`${isDark ? 'text-blue-200' : 'text-blue-700'}`}>Cette semaine</div>
        </Card>
        
        {/* Valeur totale - Purple */}
        <Card className={`p-6 text-center ${isDark ? 'bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'}`}>
          <div className="text-3xl font-bold text-purple-500 mb-2">
            {formatCurrency(scheduledRides.reduce((sum, r) => sum + r.price.total, 0))}
          </div>
          <div className={`${isDark ? 'text-purple-200' : 'text-purple-700'}`}>Valeur totale</div>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-4 mb-6">
        <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
        <div className="flex gap-2">
          {[
            { value: "upcoming", label: "À venir" },
            { value: "today", label: "Aujourd'hui" },
            { value: "week", label: "Cette semaine" },
            { value: "all", label: "Toutes" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === option.value 
                  ? "bg-orange-500 text-white" 
                  : isDark 
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des courses programmées */}
      {scheduledRides.length === 0 ? (
        <Card className={`p-12 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-300'}`} />
          <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Aucune course programmée</h3>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Vous n'avez pas encore de courses planifiées</p>
          <Button onClick={() => navigate("/ride/request")}>Programmer une course</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {scheduledRides.map((ride) => (
            <Card key={ride._id} className={`p-4 md:p-6 hover:shadow-lg transition-shadow ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              {/* Desktop Layout */}
              <div className="hidden md:flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  {/* Temps */}
                  <div className="text-center min-w-[120px]">
                    <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>
                      {formatTime(new Date(ride.scheduledTime))}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{formatDate(ride.scheduledTime)}</div>
                    <div className="text-xs text-blue-500 font-medium mt-1">{getTimeUntilRide(ride.scheduledTime)}</div>
                  </div>

                  {/* Itinéraire */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex flex-col items-center">
                      <MapPin className="w-4 h-4 text-green-500 mb-1" />
                      <div className={`w-px h-8 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                      <MapPin className="w-4 h-4 text-red-500 mt-1" />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium text-sm mb-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{ride.pickup.address}</div>
                      <div className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{ride.destination.address}</div>
                      {ride.notes && (
                        <div className={`text-xs rounded px-2 py-1 ${isDark ? 'text-gray-300 bg-gray-700' : 'text-gray-500 bg-gray-50'}`}>{ride.notes}</div>
                      )}
                    </div>
                  </div>

                  {/* Détails */}
                  <div className="text-center">
                    <div className={`font-medium capitalize text-sm ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{ride.vehicleType}</div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {ride.passengers} passager{ride.passengers > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                {/* Prix et actions */}
                <div className="text-right">
                  <div className={`font-bold text-xl mb-3 ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>{formatCurrency(ride.price.total)}</div>
                  <div className="flex gap-2">
                    {canModify(ride.scheduledTime) && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Edit className="w-4 h-4 bg-transparent" />}
                        onClick={() =>
                          navigate(`/ride/request`, {
                            state: { editRide: ride },
                          })
                        }
                        className="bg-transparent"
                      >
                        Modifier
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => {
                        setSelectedRide(ride)
                        setShowCancelModal(true)
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden">
                {/* Header with time and countdown */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className={`text-xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>
                      {formatTime(new Date(ride.scheduledTime))}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {formatDate(ride.scheduledTime)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>
                      {formatCurrency(ride.price.total)}
                    </div>
                    <div className="text-xs text-blue-500 font-medium">
                      {getTimeUntilRide(ride.scheduledTime)}
                    </div>
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex flex-col items-center mt-1">
                    <MapPin className="w-4 h-4 text-green-500 mb-1" />
                    <div className={`w-px h-6 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                    <MapPin className="w-4 h-4 text-red-500 mt-1" />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium text-sm mb-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      {ride.pickup.address}
                    </div>
                    <div className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {ride.destination.address}
                    </div>
                    {ride.notes && (
                      <div className={`text-xs rounded px-2 py-1 ${isDark ? 'text-gray-300 bg-gray-700' : 'text-gray-500 bg-gray-50'}`}>
                        {ride.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Details and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className={`font-medium capitalize text-sm ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                        {ride.vehicleType}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {ride.passengers} passager{ride.passengers > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {canModify(ride.scheduledTime) && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Edit className="w-4 h-4" />}
                        onClick={() =>
                          navigate(`/ride/request`, {
                            state: { editRide: ride },
                          })
                        }
                        className="px-3 py-1 text-xs"
                      >
                        Modifier
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => {
                        setSelectedRide(ride)
                        setShowCancelModal(true)
                      }}
                      className="px-3 py-1 text-xs"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de confirmation d'annulation */}
      {showCancelModal && selectedRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className={`w-full max-w-md p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Annuler la course programmée</h3>
            <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Êtes-vous sûr de vouloir annuler cette course programmée pour le{" "}
              <strong>{formatDate(selectedRide.scheduledTime)}</strong> à{" "}
              <strong>{formatTime(new Date(selectedRide.scheduledTime))}</strong> ?
            </p>

            <div className={`rounded-lg p-4 mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-sm">
                <div className={`font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Itinéraire:</div>
                <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedRide.pickup.address} → {selectedRide.destination.address}
                </div>
                <div className={`font-medium mt-2 mb-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Prix:</div>
                <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{formatCurrency(selectedRide.price.total)}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setShowCancelModal(false)
                  setSelectedRide(null)
                }}
              >
                Garder la course
              </Button>
              <Button variant="danger" className="flex-1" onClick={handleCancelRide}>
                Confirmer l'annulation
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default RideScheduledPage
