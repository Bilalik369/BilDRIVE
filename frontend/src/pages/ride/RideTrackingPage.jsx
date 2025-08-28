"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MapPin, Phone, MessageCircle, Navigation, Clock, Star, Car, AlertCircle, ArrowLeft } from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Loading from "../../components/ui/Loading"
import { useRide } from "../../hooks/useRide"
import { RIDE_STATUS } from "../../utils/constants"
import { formatCurrency, formatTime } from "../../utils/helpers"
import { toast } from "react-hot-toast"

const RideTrackingPage = () => {
  const { rideId } = useParams()
  const navigate = useNavigate()
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [driverLocation, setDriverLocation] = useState(null)
  const [estimatedArrival, setEstimatedArrival] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const { cancelRide } = useRide()

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const { rideApi } = await import("../../redux/api/rideApi")
        const res = await rideApi.getRideById(rideId)
        const data = res.data?.ride || res.data
        setRide(data)

        if (data.status === RIDE_STATUS.ACCEPTED) {
          setEstimatedArrival(new Date(Date.now() + 8 * 60 * 1000))
        }
      } catch (error) {
        toast.error("Erreur lors du chargement")
        navigate("/ride/history")
      } finally {
        setLoading(false)
      }
    }

    fetchRideDetails()
  }, [rideId, navigate])

  // Simulation des mises à jour en temps réel
  useEffect(() => {
    if (!ride) return

    const interval = setInterval(() => {
      // Mise à jour de la position du chauffeur
      setDriverLocation((prev) => {
        if (!prev) return prev
        return {
          latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
          longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
        }
      })

      // Mise à jour de l'ETA
      if (ride.status === RIDE_STATUS.ACCEPTED) {
        setEstimatedArrival((prev) => {
          if (!prev) return new Date(Date.now() + 8 * 60 * 1000)
          const newTime = new Date(prev.getTime() - 30000) // -30 secondes
          return newTime > new Date() ? newTime : new Date(Date.now() + 60000)
        })
      }
    }, 5000) // Mise à jour toutes les 5 secondes

    return () => clearInterval(interval)
  }, [ride])

  const getStatusConfig = (status) => {
    const configs = {
      [RIDE_STATUS.SEARCHING]: {
        title: "Recherche d'un chauffeur",
        description: "Nous cherchons le meilleur chauffeur pour vous",
        color: "bg-yellow-500",
        textColor: "text-yellow-600",
        bgColor: "bg-yellow-50",
        icon: Clock,
        progress: 25,
        animated: true,
      },
      [RIDE_STATUS.ACCEPTED]: {
        title: "Chauffeur en route",
        description: "Votre chauffeur arrive vers vous",
        color: "bg-green-500",
        textColor: "text-green-600",
        bgColor: "bg-green-50",
        icon: Car,
        progress: 50,
      },
      [RIDE_STATUS.ARRIVED]: {
        title: "Chauffeur arrivé",
        description: "Votre chauffeur vous attend",
        color: "bg-purple-500",
        textColor: "text-purple-600",
        bgColor: "bg-purple-50",
        icon: MapPin,
        progress: 75,
      },
      [RIDE_STATUS.IN_PROGRESS]: {
        title: "Course en cours",
        description: "Vous êtes en route vers votre destination",
        color: "bg-indigo-500",
        textColor: "text-indigo-600",
        bgColor: "bg-indigo-50",
        icon: Navigation,
        progress: 90,
      },
    }
    return configs[status] || configs[RIDE_STATUS.SEARCHING]
  }

  const handleCancelRide = async () => {
    if (!cancelReason.trim()) {
      toast.error("Veuillez indiquer une raison d'annulation")
      return
    }

    try {
      await cancelRide(ride._id, cancelReason)
      setRide({ ...ride, status: RIDE_STATUS.CANCELLED })
      setShowCancelModal(false)
      toast.success("Course annulée avec succès")
      navigate("/ride/history")
    } catch (error) {
      toast.error("Erreur lors de l'annulation")
    }
  }

  const canCancel = [RIDE_STATUS.SEARCHING, RIDE_STATUS.ACCEPTED].includes(ride?.status)

  if (loading) return <Loading />

  if (!ride) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Course introuvable</h2>
        <p className="text-gray-600 mb-6">Cette course n'existe pas ou a été supprimée</p>
        <Button onClick={() => navigate("/ride/history")}>Retour à l'historique</Button>
      </div>
    )
  }

  const statusConfig = getStatusConfig(ride.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Suivi de course</h1>
          <p className="text-gray-600">Course #{ride._id.slice(-8)}</p>
        </div>
      </div>

      {/* Statut principal */}
      <Card className="p-8 mb-8">
        <div className="text-center mb-6">
          <div className={`inline-flex p-4 rounded-full ${statusConfig.color} text-white mb-4`}>
            {statusConfig.animated ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : (
              <StatusIcon className="w-8 h-8" />
            )}
          </div>
          <h2 className="text-3xl font-bold mb-2">{statusConfig.title}</h2>
          <p className="text-gray-600 text-lg">{statusConfig.description}</p>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div
            className={`${statusConfig.color} h-3 rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${statusConfig.progress}%` }}
          ></div>
        </div>

        {/* ETA */}
        {estimatedArrival && ride.status === RIDE_STATUS.ACCEPTED && (
          <div className={`p-4 rounded-lg ${statusConfig.bgColor} text-center`}>
            <div className="flex items-center justify-center gap-2">
              <Clock className={`w-5 h-5 ${statusConfig.textColor}`} />
              <span className={`font-semibold ${statusConfig.textColor}`}>
                Arrivée estimée: {formatTime(estimatedArrival)}
              </span>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Carte et itinéraire */}
        <div className="lg:col-span-2 space-y-6">
          {/* Carte en temps réel */}
          <Card className="p-0 overflow-hidden">
            <div className="h-96 bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <div className="text-xl font-semibold text-gray-700 mb-2">Carte en temps réel</div>
                  <div className="text-gray-600">Suivi de votre course en direct</div>
                </div>
              </div>

              {/* Simulation des marqueurs */}
              <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Point de départ</span>
                </div>
              </div>

              <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Destination</span>
                </div>
              </div>

              {driverLocation && ride.status === RIDE_STATUS.ACCEPTED && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-white rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="w-4 h-4" />
                    <span>Chauffeur</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Itinéraire détaillé */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Itinéraire</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">Point de départ</div>
                  <div className="text-gray-600">{ride.pickup.address}</div>
                </div>
              </div>

              <div className="border-l-2 border-dashed border-gray-300 ml-2 h-12"></div>

              <div className="flex items-start gap-4">
                <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">Destination</div>
                  <div className="text-gray-600">{ride.destination.address}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informations du chauffeur */}
          {ride.driver && ride.status !== RIDE_STATUS.SEARCHING && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Votre chauffeur</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {ride.driver.firstName.charAt(0)}
                  {ride.driver.lastName.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-lg">
                    {ride.driver.firstName} {ride.driver.lastName}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{ride.driver.rating}</span>
                    <span className="text-gray-500">({ride.driver.totalRides} courses)</span>
                  </div>
                </div>
              </div>

              {/* Informations du véhicule */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold">
                    {ride.driver.vehicle.make} {ride.driver.vehicle.model}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {ride.driver.vehicle.color} • {ride.driver.vehicle.licensePlate}
                </div>
              </div>

              {/* Actions de contact */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  icon={<Phone className="w-4 h-4" />}
                >
                  Appeler
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  icon={<MessageCircle className="w-4 h-4" />}
                >
                  Message
                </Button>
              </div>
            </Card>
          )}

          {/* Détails de la course */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Détails de la course</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Type de véhicule:</span>
                <span className="font-semibold capitalize">{ride.vehicleType}</span>
              </div>
              <div className="flex justify-between">
                <span>Passagers:</span>
                <span className="font-semibold">{ride.passengers}</span>
              </div>
              <div className="flex justify-between">
                <span>Paiement:</span>
                <span className="font-semibold capitalize">{ride.payment?.method || "-"}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg">Prix total:</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(ride.price.total)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="space-y-3">
              {canCancel && (
                <Button variant="danger" className="w-full" onClick={() => setShowCancelModal(true)}>
                  Annuler la course
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => navigate(`/ride/details/${ride._id}`)}
              >
                Voir les détails
              </Button>

              <Button variant="ghost" className="w-full">
                Contacter le support
              </Button>
            </div>
          </Card>

          {/* Conseils */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold mb-3 text-blue-800">Conseils</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Soyez prêt à l'heure d'arrivée estimée</li>
              <li>• Vérifiez la plaque d'immatriculation</li>
              <li>• Gardez votre téléphone chargé</li>
              <li>• Contactez le chauffeur si nécessaire</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Modal d'annulation */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">Annuler la course</h3>
            <p className="text-gray-600 mb-4">Pourquoi souhaitez-vous annuler cette course ?</p>

            <div className="space-y-3 mb-6">
              {[
                "Changement de plans",
                "Temps d'attente trop long",
                "Problème avec l'adresse",
                "Urgence",
                "Autre raison",
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            {cancelReason === "Autre raison" && (
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none"
                rows="3"
                placeholder="Précisez la raison..."
                onChange={(e) => setCancelReason(e.target.value)}
              />
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowCancelModal(false)}>
                Retour
              </Button>
              <Button variant="danger" className="flex-1" onClick={handleCancelRide} disabled={!cancelReason}>
                Confirmer l'annulation
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default RideTrackingPage
