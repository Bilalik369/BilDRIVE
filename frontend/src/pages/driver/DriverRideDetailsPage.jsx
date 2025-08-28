"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  FiMapPin,
  FiNavigation,
  FiUser,
  FiPhone,
  FiMessageSquare,
  FiNavigation2,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Loading from "../../components/ui/Loading"
import Modal from "../../components/ui/Modal"
import { toast } from "react-hot-toast"

const DriverRideDetailsPage = () => {
  const { rideId } = useParams()
  const navigate = useNavigate()
  
  const { user } = useSelector((state) => state.auth)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  const [ride, setRide] = useState({
    id: rideId,
    status: "accepted",
    passenger: {
      name: "Sophie Martin",
      phone: "+33 6 12 34 56 78",
      rating: 4.8,
      totalRides: 156,
      memberSince: "Mars 2022",
    },
    pickupAddress: "Gare de Lyon, Place Louis-Armand, 75012 Paris",
    destinationAddress: "Aéroport Charles de Gaulle, Terminal 2E, 95700 Roissy-en-France",
    pickupNotes: "Sortie Hall 1, près du café",
    destinationNotes: "Départ Terminal 2E, Vol AF1234",
    distance: 32.5,
    estimatedDuration: 45,
    passengers: 2,
    vehicleType: "comfort",
    price: 65.0,
    basePrice: 45.0,
    distancePrice: 15.0,
    timePrice: 5.0,
    surcharge: 0.0,
    paymentMethod: "Carte bancaire",
    promoCode: null,
    specialRequests: "Vol à 14h30, merci d'être ponctuel",
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    scheduledTime: new Date(Date.now() + 15 * 60 * 1000),
    timeline: [
      {
        title: "Course demandée",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        completed: true,
      },
      {
        title: "Course acceptée",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        completed: true,
      },
      {
        title: "Arrivée au point de départ",
        timestamp: null,
        completed: false,
      },
      {
        title: "Course en cours",
        timestamp: null,
        completed: false,
      },
      {
        title: "Course terminée",
        timestamp: null,
        completed: false,
      },
    ],
  })

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Refreshing ride details...")
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdateLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const statusMessages = {
        arrived: "Arrivée confirmée",
        inProgress: "Course démarrée",
        completed: "Course terminée avec succès",
      }

      setRide((prev) => ({ ...prev, status: newStatus }))
      toast.success(statusMessages[newStatus])

      if (newStatus === "completed") {
        navigate(`/driver/ride-rating/${rideId}`)
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleCancelRide = async () => {
    if (!cancelReason.trim()) {
      toast.error("Veuillez sélectionner une raison")
      return
    }

    try {
      setCancelLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Course annulée")
      setShowCancelModal(false)
      navigate("/driver/dashboard")
    } catch (error) {
      toast.error("Erreur lors de l'annulation")
    } finally {
      setCancelLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      accepted: "text-blue-600 bg-blue-100",
      arrived: "text-purple-600 bg-purple-100",
      inProgress: "text-green-600 bg-green-100",
      completed: "text-gray-600 bg-gray-100",
      cancelled: "text-red-600 bg-red-100",
    }
    return colors[status] || colors.accepted
  }

  const getStatusLabel = (status) => {
    const labels = {
      accepted: "Acceptée",
      arrived: "Arrivé",
      inProgress: "En cours",
      completed: "Terminée",
      cancelled: "Annulée",
    }
    return labels[status] || status
  }

  const getNextAction = (status) => {
    switch (status) {
      case "accepted":
        return {
          label: "Confirmer l'arrivée",
          action: () => handleStatusUpdate("arrived"),
          icon: FiCheckCircle,
          color: "bg-purple-600 hover:bg-purple-700",
        }
      case "arrived":
        return {
          label: "Démarrer la course",
          action: () => handleStatusUpdate("inProgress"),
          icon: FiNavigation2,
          color: "bg-green-600 hover:bg-green-700",
        }
      case "inProgress":
        return {
          label: "Terminer la course",
          action: () => handleStatusUpdate("completed"),
          icon: FiCheckCircle,
          color: "bg-blue-600 hover:bg-blue-700",
        }
      default:
        return null
    }
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

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course introuvable</h2>
          <p className="text-gray-600 mb-4">Cette course n'existe pas ou vous n'y avez pas accès.</p>
          <Button onClick={() => navigate("/driver/dashboard")}>Retour au tableau de bord</Button>
        </Card>
      </div>
    )
  }

  const nextAction = getNextAction(ride.status)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button onClick={() => navigate("/driver/dashboard")} variant="outline" size="sm">
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Détails de la course</h1>
              <p className="text-gray-600">Course #{ride.id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ride.status)}`}>
              {getStatusLabel(ride.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Itinéraire</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <FiMapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Point de départ</p>
                    <p className="text-gray-600">{ride.pickupAddress}</p>
                    {ride.pickupNotes && <p className="text-sm text-blue-600 mt-1">Note: {ride.pickupNotes}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-px h-8 bg-gray-300"></div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <FiNavigation className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Destination</p>
                    <p className="text-gray-600">{ride.destinationAddress}</p>
                    {ride.destinationNotes && (
                      <p className="text-sm text-blue-600 mt-1">Note: {ride.destinationNotes}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="font-semibold">{formatDistance(ride.distance)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Durée estimée</p>
                    <p className="font-semibold">{formatDuration(ride.estimatedDuration)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Passagers</p>
                    <p className="font-semibold">{ride.passengers} personne(s)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type de véhicule</p>
                    <p className="font-semibold">{ride.vehicleType}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Passenger Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations passager</h2>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{ride.passenger.name}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>⭐ {ride.passenger.rating.toFixed(1)}</span>
                    <span>{ride.passenger.totalRides} courses</span>
                    <span>Membre depuis {ride.passenger.memberSince}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => window.open(`tel:${ride.passenger.phone}`)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <FiPhone className="w-4 h-4 mr-2" />
                  Appeler
                </Button>
                <Button
                  onClick={() => navigate(`/driver/chat/${ride.id}`)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <FiMessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>

              {ride.specialRequests && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 mb-1">Demandes spéciales:</p>
                  <p className="text-sm text-yellow-700">{ride.specialRequests}</p>
                </div>
              )}
            </Card>

            {/* Timeline */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Chronologie</h2>

              <div className="space-y-4">
                {ride.timeline.map((event, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`p-1 rounded-full ${event.completed ? "bg-green-100" : "bg-gray-100"}`}>
                      <div className={`w-2 h-2 rounded-full ${event.completed ? "bg-green-600" : "bg-gray-400"}`}></div>
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${event.completed ? "text-gray-900" : "text-gray-500"}`}>
                        {event.title}
                      </p>
                      {event.timestamp && <p className="text-sm text-gray-600">{event.timestamp.toLocaleString()}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tarification</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix de base</span>
                  <span className="font-medium">{ride.basePrice.toFixed(2)}€</span>
                </div>
                {ride.distancePrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance</span>
                    <span className="font-medium">{ride.distancePrice.toFixed(2)}€</span>
                  </div>
                )}
                {ride.timePrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temps</span>
                    <span className="font-medium">{ride.timePrice.toFixed(2)}€</span>
                  </div>
                )}
                {ride.surcharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Supplément</span>
                    <span className="font-medium">{ride.surcharge.toFixed(2)}€</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-green-600 text-lg">{ride.price.toFixed(2)}€</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">Vos gains: {(ride.price * 0.8).toFixed(2)}€ (80%)</div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>

              <div className="space-y-3">
                {nextAction && (
                  <Button onClick={nextAction.action} loading={updateLoading} className={`w-full ${nextAction.color}`}>
                    <nextAction.icon className="w-4 h-4 mr-2" />
                    {nextAction.label}
                  </Button>
                )}

                <Button
                  onClick={() => navigate(`/driver/ride-tracking/${rideId}`)}
                  variant="outline"
                  className="w-full"
                  disabled={ride.status === "completed" || ride.status === "cancelled"}
                >
                  <FiNavigation2 className="w-4 h-4 mr-2" />
                  Suivre sur la carte
                </Button>

                {["accepted", "arrived"].includes(ride.status) && (
                  <Button
                    onClick={() => setShowCancelModal(true)}
                    variant="outline"
                    className="w-full text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <FiAlertCircle className="w-4 h-4 mr-2" />
                    Annuler la course
                  </Button>
                )}
              </div>
            </Card>

            {/* Trip Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Demandée le</span>
                  <span>{ride.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Heure de départ</span>
                  <span>{ride.scheduledTime.toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mode de paiement</span>
                  <span>{ride.paymentMethod}</span>
                </div>
                {ride.promoCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Code promo</span>
                    <span className="text-green-600">{ride.promoCode}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Cancel Modal */}
        <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Annuler la course">
          <div className="space-y-4">
            <p className="text-gray-700">Pourquoi souhaitez-vous annuler cette course ?</p>

            <div className="space-y-2">
              {[
                "Problème véhicule",
                "Urgence personnelle",
                "Passager introuvable",
                "Conditions météo",
                "Embouteillages importants",
                "Autre raison",
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={cancelReason === reason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">{reason}</span>
                </label>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ L'annulation peut affecter votre note et votre taux d'acceptation.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setShowCancelModal(false)} variant="outline" className="flex-1">
                Retour
              </Button>
              <Button
                onClick={handleCancelRide}
                loading={cancelLoading}
                variant="outline"
                className="flex-1 text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                disabled={!cancelReason}
              >
                Confirmer l'annulation
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default DriverRideDetailsPage
