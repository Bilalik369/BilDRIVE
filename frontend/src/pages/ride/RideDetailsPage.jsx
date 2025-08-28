"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MapPin, Phone, MessageCircle, Star, Car, Clock, User, CreditCard, Calendar, AlertCircle } from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Loading from "../../components/ui/Loading"
import { useRide } from "../../hooks/useRide"
import { RIDE_STATUS } from "../../utils/constants"
import { formatCurrency, formatDate, formatTime, formatDistance, formatDuration } from "../../utils/helpers"
import { toast } from "react-hot-toast"
import { rideApi } from "../../redux/api/rideApi"

const RideDetailsPage = () => {
  const { rideId } = useParams()
  const navigate = useNavigate()
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const { cancelRide, rateRide } = useRide()

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const res = await rideApi.getRideById(rideId)
        const data = res.data?.ride || res.data
        setRide(data)
      } catch (error) {
        toast.error("Erreur lors du chargement des détails")
        navigate("/ride/history")
      } finally {
        setLoading(false)
      }
    }

    fetchRideDetails()
  }, [rideId, navigate])

  const getStatusConfig = (status) => {
    const configs = {
      [RIDE_STATUS.REQUESTED]: {
        color: "bg-blue-500",
        textColor: "text-blue-600",
        bgColor: "bg-blue-50",
        label: "Demandée",
      },
      [RIDE_STATUS.SEARCHING]: {
        color: "bg-yellow-500",
        textColor: "text-yellow-600",
        bgColor: "bg-yellow-50",
        label: "Recherche en cours",
      },
      [RIDE_STATUS.ACCEPTED]: {
        color: "bg-green-500",
        textColor: "text-green-600",
        bgColor: "bg-green-50",
        label: "Acceptée",
      },
      [RIDE_STATUS.ARRIVED]: {
        color: "bg-purple-500",
        textColor: "text-purple-600",
        bgColor: "bg-purple-50",
        label: "Chauffeur arrivé",
      },
      [RIDE_STATUS.IN_PROGRESS]: {
        color: "bg-indigo-500",
        textColor: "text-indigo-600",
        bgColor: "bg-indigo-50",
        label: "En cours",
      },
      [RIDE_STATUS.COMPLETED]: {
        color: "bg-green-600",
        textColor: "text-green-600",
        bgColor: "bg-green-50",
        label: "Terminée",
      },
      [RIDE_STATUS.CANCELLED]: {
        color: "bg-red-500",
        textColor: "text-red-600",
        bgColor: "bg-red-50",
        label: "Annulée",
      },
    }
    return configs[status] || configs[RIDE_STATUS.REQUESTED]
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
    } catch (error) {
      toast.error("Erreur lors de l'annulation")
    }
  }

  const canCancel = [RIDE_STATUS.REQUESTED, RIDE_STATUS.SEARCHING, RIDE_STATUS.ACCEPTED].includes(ride?.status)
  const canRate = ride?.status === RIDE_STATUS.COMPLETED && !ride?.rating
  const canTrack = [RIDE_STATUS.ACCEPTED, RIDE_STATUS.ARRIVED, RIDE_STATUS.IN_PROGRESS].includes(ride?.status)

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Détails de la course</h1>
          <p className="text-gray-600">Course #{ride._id.slice(-8)}</p>
        </div>
        <div className={`px-4 py-2 rounded-full ${statusConfig.bgColor}`}>
          <span className={`font-semibold ${statusConfig.textColor}`}>{statusConfig.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Itinéraire */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Itinéraire</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">Point de départ</div>
                  <div className="text-gray-600">{ride.pickup.address}</div>
                  <div className="text-sm text-gray-500 mt-1">{formatDate(ride.createdAt)}</div>
                </div>
              </div>

              <div className="border-l-2 border-dashed border-gray-300 ml-2 h-12"></div>

              <div className="flex items-start gap-4">
                <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">Destination</div>
                  <div className="text-gray-600">{ride.destination.address}</div>
                  {ride.status === RIDE_STATUS.COMPLETED && (
                    <div className="text-sm text-gray-500 mt-1">
                      Arrivée: {formatTime(new Date(new Date(ride.createdAt).getTime() + (ride.duration || 0) * 1000))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Détails de la course */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Informations de la course</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Car className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <div className="font-semibold capitalize">{ride.vehicleType}</div>
                <div className="text-sm text-gray-600">Type de véhicule</div>
              </div>
              <div className="text-center">
                <User className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <div className="font-semibold">{ride.passengers}</div>
                <div className="text-sm text-gray-600">Passagers</div>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <div className="font-semibold">{ride.displayDistance || formatDistance(ride.distance)}</div>
                <div className="text-sm text-gray-600">Distance</div>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <div className="font-semibold">{ride.displayDuration || formatDuration(ride.duration)}</div>
                <div className="text-sm text-gray-600">Durée</div>
              </div>
            </div>

            {ride.notes && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold mb-2">Instructions spéciales</div>
                <div className="text-gray-700">{ride.notes}</div>
              </div>
            )}
          </Card>

          {/* Informations du chauffeur */}
          {ride.driver && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Informations du chauffeur</h3>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {ride.driver.firstName.charAt(0)}
                  {ride.driver.lastName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-semibold mb-1">
                    {ride.driver.firstName} {ride.driver.lastName}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{ride.driver.rating}</span>
                    <span className="text-gray-500">({ride.driver.totalRides} courses)</span>
                  </div>
                  <div className="text-gray-600">{ride.driver.phone}</div>
                </div>
              </div>

              {/* Informations du véhicule */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Car className="w-6 h-6 text-gray-600" />
                  <span className="font-semibold text-lg">
                    {ride.driver.vehicle.make} {ride.driver.vehicle.model}
                  </span>
                </div>
                <div className="text-gray-600">
                  {ride.driver.vehicle.color} • {ride.driver.vehicle.licensePlate}
                </div>
              </div>

              {/* Actions de contact */}
              {canTrack && (
                <div className="flex gap-4 mt-6">
                  <Button variant="outline" className="flex-1 bg-transparent" icon={<Phone className="w-4 h-4" />}>
                    Appeler
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    icon={<MessageCircle className="w-4 h-4" />}
                  >
                    Message
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Facturation */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Facturation</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Prix de base:</span>
                <span>{formatCurrency(ride.price.base)}</span>
              </div>
              <div className="flex justify-between">
                <span>Distance ({formatDistance(ride.distance)}):</span>
                <span>{formatCurrency(ride.price?.distance || 0)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(ride.price.total)}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payé par {ride.payment?.method === "card" ? "carte bancaire" : ride.payment?.method || "-"}
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="space-y-3">
              {canTrack && (
                <Button className="w-full" onClick={() => navigate(`/ride/tracking/${ride._id}`)}>
                  Suivre la course
                </Button>
              )}

              {canRate && (
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => navigate(`/ride/rating/${ride._id}`)}
                >
                  Noter le chauffeur
                </Button>
              )}

              {canCancel && (
                <Button variant="danger" className="w-full" onClick={() => setShowCancelModal(true)}>
                  Annuler la course
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() =>
                  navigate("/ride/request", {
                    state: {
                      pickup: ride.pickup.address,
                      destination: ride.destination.address,
                    },
                  })
                }
              >
                Refaire cette course
              </Button>

              <Button variant="ghost" className="w-full">
                Télécharger le reçu
              </Button>
            </div>
          </Card>

          {/* Informations supplémentaires */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Informations</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Demandée le {formatDate(ride.createdAt)}</span>
              </div>
              {ride.scheduledTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>Programmée pour {formatDate(ride.scheduledTime)}</span>
                </div>
              )}
              <div className="text-gray-600">Course #{ride._id.slice(-8)}</div>
            </div>
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

export default RideDetailsPage
