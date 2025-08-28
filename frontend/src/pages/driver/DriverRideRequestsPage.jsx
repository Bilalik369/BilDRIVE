"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  FiMapPin,
  FiNavigation,
  FiClock,
  FiUser,
  FiRefreshCw,
  FiFilter,
  FiCheck,
  FiX,
  FiBell,
  FiAlertCircle,
} from "react-icons/fi"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Loading from "../../components/ui/Loading"
import Modal from "../../components/ui/Modal"
import { toast } from "react-hot-toast"

const DriverRideRequestsPage = () => {
  const navigate = useNavigate()
  
  const { user } = useSelector((state) => state.auth)
  const [selectedRide, setSelectedRide] = useState(null)
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [declineReason, setDeclineReason] = useState("")
  const [filters, setFilters] = useState({
    minPrice: "",
    maxDistance: "",
    vehicleType: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptLoading, setAcceptLoading] = useState(false)
  const [declineLoading, setDeclineLoading] = useState(false)

  const [rideRequests, setRideRequests] = useState([
    {
      id: "req_001",
      passenger: {
        name: "Sophie Martin",
        rating: 4.8,
        totalRides: 156,
        phone: "+33 6 12 34 56 78",
      },
      pickupAddress: "Gare de Lyon, 75012 Paris",
      destinationAddress: "Aéroport Charles de Gaulle, Terminal 2E",
      price: 65.0,
      distance: 32.5,
      estimatedDuration: 45,
      passengers: 2,
      vehicleType: "comfort",
      priority: "high",
      notes: "Vol à 14h30, merci d'être ponctuel",
      timeAgo: "2 min",
      expiresIn: "8 min",
      scheduledTime: new Date(Date.now() + 15 * 60 * 1000),
    },
    {
      id: "req_002",
      passenger: {
        name: "Thomas Dubois",
        rating: 4.6,
        totalRides: 89,
        phone: "+33 6 98 76 54 32",
      },
      pickupAddress: "Place de la République, 75003 Paris",
      destinationAddress: "Tour Eiffel, 75007 Paris",
      price: 18.5,
      distance: 5.2,
      estimatedDuration: 18,
      passengers: 1,
      vehicleType: "economy",
      priority: "medium",
      notes: "",
      timeAgo: "5 min",
      expiresIn: "5 min",
      scheduledTime: new Date(Date.now() + 5 * 60 * 1000),
    },
    {
      id: "req_003",
      passenger: {
        name: "Marie Leroy",
        rating: 4.9,
        totalRides: 234,
        phone: "+33 6 11 22 33 44",
      },
      pickupAddress: "Châtelet-Les Halles, 75001 Paris",
      destinationAddress: "Gare du Nord, 75010 Paris",
      price: 12.8,
      distance: 3.1,
      estimatedDuration: 12,
      passengers: 1,
      vehicleType: "economy",
      priority: "low",
      notes: "",
      timeAgo: "8 min",
      expiresIn: "2 min",
      scheduledTime: new Date(Date.now() + 2 * 60 * 1000),
    },
  ])

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate fetching new requests
      console.log("Refreshing ride requests...")
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleAcceptRide = async () => {
    if (!selectedRide) return

    try {
      setAcceptLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Course acceptée avec succès!")
      setShowAcceptModal(false)
      setSelectedRide(null)

      // Remove from requests list
      setRideRequests((prev) => prev.filter((ride) => ride.id !== selectedRide.id))

      navigate(`/driver/ride-details/${selectedRide.id}`)
    } catch (error) {
      toast.error("Erreur lors de l'acceptation")
    } finally {
      setAcceptLoading(false)
    }
  }

  const handleDeclineRide = async () => {
    if (!selectedRide || !declineReason) return

    try {
      setDeclineLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast("Course déclinée")
      setShowDeclineModal(false)
      setSelectedRide(null)
      setDeclineReason("")

      // Remove from requests list
      setRideRequests((prev) => prev.filter((ride) => ride.id !== selectedRide.id))
    } catch (error) {
      toast.error("Erreur lors du refus")
    } finally {
      setDeclineLoading(false)
    }
  }

  const getVehicleTypeLabel = (type) => {
    const types = {
      economy: "Économique",
      comfort: "Confort",
      premium: "Premium",
      xl: "XL",
    }
    return types[type] || type
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-600 bg-red-100",
      medium: "text-yellow-600 bg-yellow-100",
      low: "text-green-600 bg-green-100",
    }
    return colors[priority] || colors.medium
  }

  const formatDistance = (distance) => {
    return `${distance.toFixed(1)} km`
  }

  const formatDuration = (duration) => {
    return `${duration} min`
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Demandes de course</h1>
              <p className="text-gray-600 mt-1">{rideRequests.length} demande(s) disponible(s)</p>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => setShowFilters(!showFilters)} variant="outline" size="sm">
                <FiFilter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
              <Button onClick={() => setIsLoading(true)} variant="outline" size="sm">
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="mt-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix minimum</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0€"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Distance max (km)</label>
                  <input
                    type="number"
                    value={filters.maxDistance}
                    onChange={(e) => setFilters({ ...filters, maxDistance: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de véhicule</label>
                  <select
                    value={filters.vehicleType}
                    onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tous</option>
                    <option value="economy">Économique</option>
                    <option value="comfort">Confort</option>
                    <option value="premium">Premium</option>
                    <option value="xl">XL</option>
                  </select>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Availability Warning */}
        {!user?.isAvailable && (
          <Card className="mb-6 p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <FiAlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-yellow-800">Vous êtes actuellement indisponible</p>
                <p className="text-yellow-700 text-sm">
                  Activez votre disponibilité pour recevoir des demandes de course
                </p>
              </div>
              <Button onClick={() => navigate("/driver/availability")} size="sm">
                Activer
              </Button>
            </div>
          </Card>
        )}

        {/* Ride Requests */}
        {rideRequests.length > 0 ? (
          <div className="space-y-4">
            {rideRequests.map((ride) => (
              <Card key={ride.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Ride Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <FiUser className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{ride.passenger.name}</p>
                          <p className="text-sm text-gray-600">
                            ⭐ {ride.passenger.rating.toFixed(1)} • {ride.passenger.totalRides} courses
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ride.priority)}`}
                        >
                          {ride.priority === "high" && "Urgent"}
                          {ride.priority === "medium" && "Normal"}
                          {ride.priority === "low" && "Flexible"}
                        </span>
                        <span className="text-2xl font-bold text-green-600">{ride.price.toFixed(2)}€</span>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-green-100 rounded-full mt-1">
                          <FiMapPin className="w-3 h-3 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Départ</p>
                          <p className="text-gray-600 text-sm">{ride.pickupAddress}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-red-100 rounded-full mt-1">
                          <FiNavigation className="w-3 h-3 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Destination</p>
                          <p className="text-gray-600 text-sm">{ride.destinationAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Distance</p>
                        <p className="font-medium">{formatDistance(ride.distance)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Durée estimée</p>
                        <p className="font-medium">{formatDuration(ride.estimatedDuration)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Passagers</p>
                        <p className="font-medium">{ride.passengers} personne(s)</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Véhicule</p>
                        <p className="font-medium">{getVehicleTypeLabel(ride.vehicleType)}</p>
                      </div>
                    </div>

                    {ride.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Note:</span> {ride.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-3 lg:w-32">
                    <Button
                      onClick={() => {
                        setSelectedRide(ride)
                        setShowAcceptModal(true)
                      }}
                      className="flex-1 lg:flex-none"
                      disabled={!user?.isAvailable}
                    >
                      <FiCheck className="w-4 h-4 mr-2" />
                      Accepter
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedRide(ride)
                        setShowDeclineModal(true)
                      }}
                      variant="outline"
                      className="flex-1 lg:flex-none"
                    >
                      <FiX className="w-4 h-4 mr-2" />
                      Refuser
                    </Button>
                  </div>
                </div>

                {/* Time remaining */}
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiClock className="w-4 h-4" />
                    <span>Demande reçue {ride.timeAgo}</span>
                  </div>
                  <div className="text-sm text-orange-600 font-medium">Expire dans {ride.expiresIn}</div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
              <FiBell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune demande disponible</h3>
            <p className="text-gray-600 mb-6">
              {user?.isAvailable
                ? "Aucune nouvelle demande de course pour le moment."
                : "Activez votre disponibilité pour recevoir des demandes."}
            </p>
            {!user?.isAvailable && (
              <Button onClick={() => navigate("/driver/availability")}>Activer la disponibilité</Button>
            )}
          </Card>
        )}

        {/* Accept Modal */}
        <Modal isOpen={showAcceptModal} onClose={() => setShowAcceptModal(false)} title="Accepter la course">
          {selectedRide && (
            <div className="space-y-4">
              <p className="text-gray-700">Êtes-vous sûr de vouloir accepter cette course ?</p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Prix de la course:</span>
                  <span className="text-xl font-bold text-green-600">{selectedRide.price.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Distance:</span>
                  <span className="text-sm">{formatDistance(selectedRide.distance)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Durée estimée:</span>
                  <span className="text-sm">{formatDuration(selectedRide.estimatedDuration)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setShowAcceptModal(false)} variant="outline" className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handleAcceptRide} loading={acceptLoading} className="flex-1">
                  Confirmer l'acceptation
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Decline Modal */}
        <Modal isOpen={showDeclineModal} onClose={() => setShowDeclineModal(false)} title="Refuser la course">
          {selectedRide && (
            <div className="space-y-4">
              <p className="text-gray-700">Pourquoi refusez-vous cette course ?</p>

              <div className="space-y-2">
                {[
                  "Trop loin de ma position",
                  "Prix trop bas",
                  "Destination non souhaitée",
                  "Pause en cours",
                  "Autre raison",
                ].map((reason) => (
                  <label key={reason} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="declineReason"
                      value={reason}
                      checked={declineReason === reason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">{reason}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setShowDeclineModal(false)} variant="outline" className="flex-1">
                  Annuler
                </Button>
                <Button
                  onClick={handleDeclineRide}
                  loading={declineLoading}
                  variant="outline"
                  className="flex-1 bg-transparent"
                  disabled={!declineReason}
                >
                  Confirmer le refus
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default DriverRideRequestsPage
