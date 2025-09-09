import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MapPin, Phone, MessageCircle, Star, Car, Clock, User, CreditCard, Calendar, AlertCircle, Navigation } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Détails de la course</h1>
                  <p className="text-gray-600">Course #{ride._id.slice(-8)}</p>
                </div>
              </div>
            </div>
            <div className={`px-6 py-3 rounded-full text-lg font-semibold ${statusConfig.bgColor}`}>
              <span className={statusConfig.textColor}>{statusConfig.label}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Route Information */}
            <Card className="p-8 border-0 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <MapPin className="w-7 h-7 text-blue-600" />
                Itinéraire
              </h3>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Point de départ</div>
                    <div className="text-xl font-semibold text-gray-900 mb-2">{ride.pickup.address}</div>
                    <div className="text-sm text-gray-500">{formatDate(ride.createdAt)}</div>
                  </div>
                </div>

                <div className="border-l-2 border-dashed border-gray-300 ml-5 h-16"></div>

                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Destination</div>
                    <div className="text-xl font-semibold text-gray-900 mb-2">{ride.destination.address}</div>
                    {ride.status === RIDE_STATUS.COMPLETED && (
                      <div className="text-sm text-gray-500">
                        Arrivée: {formatTime(new Date(new Date(ride.createdAt).getTime() + (ride.duration || 0) * 1000))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Ride Details */}
            <Card className="p-8 border-0 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Car className="w-7 h-7 text-purple-600" />
                Informations de la course
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* Vehicle Type - Blue */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <Car className="w-10 h-10 mx-auto mb-4 text-blue-600" />
                  <div className="font-bold text-xl capitalize text-blue-900">{ride.vehicleType}</div>
                  <div className="text-sm text-blue-700 mt-2">Type de véhicule</div>
                </div>
                
                {/* Passengers - Green */}
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <User className="w-10 h-10 mx-auto mb-4 text-green-600" />
                  <div className="font-bold text-xl text-green-900">{ride.passengers}</div>
                  <div className="text-sm text-green-700 mt-2">Passagers</div>
                </div>
                
                {/* Distance - Orange */}
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <MapPin className="w-10 h-10 mx-auto mb-4 text-orange-600" />
                  <div className="font-bold text-xl text-orange-900">{ride.displayDistance || formatDistance(ride.distance)}</div>
                  <div className="text-sm text-orange-700 mt-2">Distance</div>
                </div>
                
                {/* Duration - Purple */}
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <Clock className="w-10 h-10 mx-auto mb-4 text-purple-600" />
                  <div className="font-bold text-xl text-purple-900">{ride.displayDuration || formatDuration(ride.duration)}</div>
                  <div className="text-sm text-purple-700 mt-2">Durée</div>
                </div>
              </div>

              {ride.notes && (
                <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                  <div className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    Instructions spéciales
                  </div>
                  <div className="text-gray-700">{ride.notes}</div>
                </div>
              )}
            </Card>

            {/* Driver Information */}
            {ride.driver && (
              <Card className="p-8 border-0 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <User className="w-7 h-7 text-green-600" />
                  Informations du chauffeur
                </h3>
                <div className="flex items-center gap-8 mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {ride.driver.firstName.charAt(0)}
                    {ride.driver.lastName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {ride.driver.firstName} {ride.driver.lastName}
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-6 h-6 text-yellow-400 fill-current" />
                        <span className="text-xl font-bold text-gray-900">{ride.driver.rating}</span>
                      </div>
                      <span className="text-gray-500 text-lg">({ride.driver.totalRides} courses)</span>
                    </div>
                    <div className="text-gray-600 text-lg">{ride.driver.phone}</div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-4 mb-3">
                    <Car className="w-8 h-8 text-gray-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      {ride.driver.vehicle.make} {ride.driver.vehicle.model}
                    </span>
                  </div>
                  <div className="text-gray-600 text-lg">
                    {ride.driver.vehicle.color} • {ride.driver.vehicle.licensePlate}
                  </div>
                </div>

                {/* Contact Actions */}
                {canTrack && (
                  <div className="flex gap-4 mt-8">
                    <Button 
                      variant="outline" 
                      className="flex-1 bg-transparent border-green-200 text-green-600 hover:bg-green-50 py-4 text-lg" 
                      icon={<Phone className="w-5 h-5" />}
                    >
                      Appeler
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent border-blue-200 text-blue-600 hover:bg-blue-50 py-4 text-lg"
                      icon={<MessageCircle className="w-5 h-5" />}
                    >
                      Message
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Billing Information */}
            <Card className="p-8 border-0 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-purple-600" />
                Facturation
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Prix de base:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(ride.price.base)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Distance ({formatDistance(ride.distance)}):</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(ride.price?.distance || 0)}</span>
                </div>
                <div className="pt-4">
                  <div className="flex justify-between items-center py-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl px-4">
                    <span className="text-xl font-bold text-gray-900">Total:</span>
                    <span className="text-3xl font-bold text-orange-600">{formatCurrency(ride.price.total)}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-2 mt-4">
                  <CreditCard className="w-4 h-4" />
                  Payé par {ride.payment?.method === "card" ? "carte bancaire" : ride.payment?.method || "-"}
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-8 border-0 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Navigation className="w-6 h-6 text-blue-600" />
                Actions
              </h3>
              <div className="space-y-4">
                {canTrack && (
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 py-4 text-lg shadow-lg" 
                    onClick={() => navigate(`/ride/tracking/${ride._id}`)}
                    icon={<Navigation className="w-5 h-5" />}
                  >
                    Suivre la course
                  </Button>
                )}

                {canRate && (
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-yellow-200 text-yellow-600 hover:bg-yellow-50 py-4 text-lg"
                    onClick={() => navigate(`/ride/rating/${ride._id}`)}
                    icon={<Star className="w-5 h-5" />}
                  >
                    Noter le chauffeur
                  </Button>
                )}

                {canCancel && (
                  <Button 
                    variant="danger" 
                    className="w-full py-4 text-lg shadow-lg" 
                    onClick={() => setShowCancelModal(true)}
                    icon={<AlertCircle className="w-5 h-5" />}
                  >
                    Annuler la course
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full bg-transparent border-gray-200 text-gray-600 hover:bg-gray-50 py-4 text-lg"
                  onClick={() =>
                    navigate("/ride/request", {
                      state: {
                        pickup: ride.pickup.address,
                        destination: ride.destination.address,
                      },
                    })
                  }
                  icon={<Car className="w-5 h-5" />}
                >
                  Refaire cette course
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full bg-transparent border-gray-200 text-gray-600 hover:bg-gray-50 py-4 text-lg"
                  icon={<CreditCard className="w-5 h-5" />}
                >
                  Télécharger le reçu
                </Button>
              </div>
            </Card>

            {/* Additional Information */}
            <Card className="p-8 border-0 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-gray-600" />
                Informations
              </h3>
              <div className="space-y-4 text-lg">
                <div className="flex items-center gap-3 py-3 border-b border-gray-200">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">Demandée le</span>
                  <span className="font-semibold text-gray-900">{formatDate(ride.createdAt)}</span>
                </div>
                {ride.scheduledTime && (
                  <div className="flex items-center gap-3 py-3 border-b border-gray-200">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600">Programmée pour</span>
                    <span className="font-semibold text-gray-900">{formatDate(ride.scheduledTime)}</span>
                  </div>
                )}
                <div className="text-gray-500 text-sm pt-2">Course #{ride._id.slice(-8)}</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Modern Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg p-8 border-0 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <AlertCircle className="w-7 h-7 text-red-600" />
                Annuler la course
              </h3>
              <p className="text-gray-600 mb-8 text-lg">Pourquoi souhaitez-vous annuler cette course ?</p>

              <div className="space-y-4 mb-8">
                {[
                  "Changement de plans",
                  "Temps d'attente trop long",
                  "Problème avec l'adresse",
                  "Urgence",
                  "Autre raison",
                ].map((reason) => (
                  <label key={reason} className="flex items-center gap-4 cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="text-orange-500 focus:ring-orange-500 w-5 h-5"
                    />
                    <span className="text-lg">{reason}</span>
                  </label>
                ))}
              </div>

              {cancelReason === "Autre raison" && (
                <textarea
                  className="w-full p-4 border border-gray-200 rounded-xl mb-6 resize-none text-lg"
                  rows="3"
                  placeholder="Précisez la raison..."
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              )}

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1 bg-transparent border-gray-300 text-gray-600 hover:bg-gray-50 py-4 text-lg" 
                  onClick={() => setShowCancelModal(false)}
                >
                  Retour
                </Button>
                <Button 
                  variant="danger" 
                  className="flex-1 py-4 text-lg shadow-lg" 
                  onClick={handleCancelRide} 
                  disabled={!cancelReason}
                >
                  Confirmer l'annulation
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default RideDetailsPage
