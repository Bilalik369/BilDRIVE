"use client"

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

const RideScheduledPage = () => {
  const navigate = useNavigate()
  const { rides, loading, getUserRides, cancelRide } = useRide()
  const [scheduledRides, setScheduledRides] = useState([])
  const [filter, setFilter] = useState("upcoming")
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedRide, setSelectedRide] = useState(null)

  useEffect(() => {
    // Récupérer toutes les courses programmées
    getUserRides({ status: RIDE_STATUS.SCHEDULED, limit: 50 })
  }, [])

  useEffect(() => {
    // Simulation de courses programmées
    const mockScheduledRides = [
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
    ]

    const filtered = mockScheduledRides.filter((ride) => {
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
  }, [rides, filter])

  const handleCancelRide = async () => {
    if (!selectedRide) return

    try {
      await cancelRide(selectedRide._id, "Annulation par l'utilisateur")
      setScheduledRides((prev) => prev.filter((ride) => ride._id !== selectedRide._id))
      setShowCancelModal(false)
      setSelectedRide(null)
      toast.success("Course programmée annulée")
    } catch (error) {
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
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Courses programmées</h1>
          <p className="text-gray-600">Gérez vos courses planifiées à l'avance</p>
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
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">{scheduledRides.length}</div>
          <div className="text-gray-600">Total programmées</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {
              scheduledRides.filter((r) => {
                const scheduled = new Date(r.scheduledTime)
                const today = new Date()
                return scheduled.toDateString() === today.toDateString()
              }).length
            }
          </div>
          <div className="text-gray-600">Aujourd'hui</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {
              scheduledRides.filter((r) => {
                const scheduled = new Date(r.scheduledTime)
                const now = new Date()
                const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                return scheduled > now && scheduled <= weekFromNow
              }).length
            }
          </div>
          <div className="text-gray-600">Cette semaine</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {formatCurrency(scheduledRides.reduce((sum, r) => sum + r.price.total, 0))}
          </div>
          <div className="text-gray-600">Valeur totale</div>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-4 mb-6">
        <Filter className="w-5 h-5 text-gray-400" />
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
                filter === option.value ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des courses programmées */}
      {scheduledRides.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune course programmée</h3>
          <p className="text-gray-500 mb-6">Vous n'avez pas encore de courses planifiées</p>
          <Button onClick={() => navigate("/ride/request")}>Programmer une course</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {scheduledRides.map((ride) => (
            <Card key={ride._id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  {/* Temps */}
                  <div className="text-center min-w-[120px]">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {formatTime(new Date(ride.scheduledTime))}
                    </div>
                    <div className="text-sm text-gray-600">{formatDate(ride.scheduledTime)}</div>
                    <div className="text-xs text-blue-600 font-medium mt-1">{getTimeUntilRide(ride.scheduledTime)}</div>
                  </div>

                  {/* Itinéraire */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex flex-col items-center">
                      <MapPin className="w-4 h-4 text-green-500 mb-1" />
                      <div className="w-px h-8 bg-gray-300"></div>
                      <MapPin className="w-4 h-4 text-red-500 mt-1" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">{ride.pickup.address}</div>
                      <div className="text-gray-600 text-sm mb-2">{ride.destination.address}</div>
                      {ride.notes && (
                        <div className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1">{ride.notes}</div>
                      )}
                    </div>
                  </div>

                  {/* Détails */}
                  <div className="text-center">
                    <div className="font-medium capitalize text-sm">{ride.vehicleType}</div>
                    <div className="text-xs text-gray-600">
                      {ride.passengers} passager{ride.passengers > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                {/* Prix et actions */}
                <div className="text-right">
                  <div className="font-bold text-xl text-primary mb-3">{formatCurrency(ride.price.total)}</div>
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
            </Card>
          ))}
        </div>
      )}

      {/* Modal de confirmation d'annulation */}
      {showCancelModal && selectedRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">Annuler la course programmée</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir annuler cette course programmée pour le{" "}
              <strong>{formatDate(selectedRide.scheduledTime)}</strong> à{" "}
              <strong>{formatTime(new Date(selectedRide.scheduledTime))}</strong> ?
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm">
                <div className="font-medium mb-1">Itinéraire:</div>
                <div className="text-gray-600">
                  {selectedRide.pickup.address} → {selectedRide.destination.address}
                </div>
                <div className="font-medium mt-2 mb-1">Prix:</div>
                <div className="text-gray-600">{formatCurrency(selectedRide.price.total)}</div>
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
