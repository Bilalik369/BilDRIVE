"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Clock,
  User,
  Star,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  StopCircle,
  Timer
} from "lucide-react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import InteractiveMap from "../../components/Map/InteractiveMap"
import RouteInfo from "../../components/Map/RouteInfo"
import Modal from "../../components/ui/Modal"
import { toast } from "react-hot-toast"
import { calculateETA } from "../../utils/mapsClient"

const DriverActiveRidePage = () => {
  const { rideId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  
  const [driverLocation, setDriverLocation] = useState({
    coordinates: [-7.5898, 33.5731], // Casablanca center
    timestamp: Date.now()
  })
  
  const [rideStatus, setRideStatus] = useState('going_to_pickup') // going_to_pickup, waiting_for_passenger, in_progress, completed
  const [activeRide, setActiveRide] = useState({
    id: rideId,
    passenger: {
      id: "pass_001",
      name: "Sofia Amrani",
      phone: "+212 6 12 34 56 78",
      rating: 4.8,
      totalRides: 89,
      photo: null
    },
    pickup: {
      address: "Boulevard Mohammed V, Casablanca",
      coordinates: [-7.6198, 33.5731],
      instructions: "Près de la station de tram Mohammed V"
    },
    destination: {
      address: "Aéroport Mohammed V, Terminal 1",
      coordinates: [-7.5150, 33.3675],
      instructions: "Terminal 1, Départs"
    },
    vehicleType: "standard",
    passengers: 2,
    estimatedPrice: 120.00,
    estimatedDuration: 1800, // 30 minutes in seconds
    estimatedDistance: 25000, // 25km in meters
    paymentMethod: "cash",
    scheduledTime: null,
    notes: "Vol à 15h30, merci d'être ponctuel",
    createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
  })

  const [routeData, setRouteData] = useState(null)
  const [eta, setEta] = useState(null)
  const [tripTimer, setTripTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [showPassengerModal, setShowPassengerModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [completionNotes, setCompletionNotes] = useState("")
  const timerRef = useRef(null)

  // Auto-update driver location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            coordinates: [position.coords.longitude, position.coords.latitude],
            timestamp: Date.now(),
            accuracy: position.coords.accuracy
          }
          setDriverLocation(newLocation)
        },
        (error) => {
          console.error('Error getting location:', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )

      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  // Timer for active ride
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTripTimer(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isTimerRunning])

  // Calculate ETA periodically
  useEffect(() => {
    const calculateETAToTarget = async () => {
      try {
        const targetLocation = rideStatus === 'going_to_pickup' ? 
          activeRide.pickup.coordinates : 
          activeRide.destination.coordinates

        const etaData = await calculateETA(driverLocation.coordinates, targetLocation)
        setEta(etaData)
      } catch (error) {
        console.error('Error calculating ETA:', error)
      }
    }

    const interval = setInterval(calculateETAToTarget, 30000) // Update every 30 seconds
    calculateETAToTarget() // Initial calculation

    return () => clearInterval(interval)
  }, [driverLocation, rideStatus, activeRide])

  const handleDriverLocationUpdate = (newLocation) => {
    setDriverLocation(newLocation)
    // Send location to backend for real-time tracking
    // updateDriverLocationAPI(newLocation)
  }

  const handleRouteCalculated = (routeInfo) => {
    setRouteData(routeInfo)
  }

  const handleArrivedAtPickup = () => {
    setRideStatus('waiting_for_passenger')
    toast.success("Arrivé au point de rendez-vous")
    // Notify passenger
  }

  const handleStartTrip = () => {
    setRideStatus('in_progress')
    setIsTimerRunning(true)
    toast.success("Course commencée")
  }

  const handleCompleteTrip = () => {
    setShowCompleteModal(true)
  }

  const confirmCompleteTrip = () => {
    setRideStatus('completed')
    setIsTimerRunning(false)
    setShowCompleteModal(false)
    toast.success("Course terminée avec succès!")
    
    // Navigate to rating/payment screen
    setTimeout(() => {
      navigate(`/driver/ride-details/${rideId}/complete`)
    }, 1000)
  }

  const formatTimer = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusInfo = () => {
    switch (rideStatus) {
      case 'going_to_pickup':
        return {
          title: "En route vers le passager",
          subtitle: "Dirigez-vous vers le point de rendez-vous",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          action: "Marquer comme arrivé",
          onAction: handleArrivedAtPickup
        }
      case 'waiting_for_passenger':
        return {
          title: "En attente du passager",
          subtitle: "Le passager a été notifié de votre arrivée",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          action: "Commencer la course",
          onAction: handleStartTrip
        }
      case 'in_progress':
        return {
          title: "Course en cours",
          subtitle: "Direction la destination finale",
          color: "text-green-600",
          bgColor: "bg-green-50",
          action: "Terminer la course",
          onAction: handleCompleteTrip
        }
      default:
        return {
          title: "Course",
          subtitle: "",
          color: "text-gray-600",
          bgColor: "bg-gray-50"
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status Header */}
      <div className={`${statusInfo.bgColor} border-b`}>
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 ${statusInfo.bgColor} rounded-full`}>
                <Navigation className={`w-6 h-6 ${statusInfo.color}`} />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${statusInfo.color}`}>
                  {statusInfo.title}
                </h1>
                <p className="text-gray-600 text-sm">{statusInfo.subtitle}</p>
              </div>
            </div>
            
            {isTimerRunning && (
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
                <Timer className="w-5 h-5 text-green-600" />
                <span className="font-mono text-lg font-bold text-green-600">
                  {formatTimer(tripTimer)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Navigation</h2>
                {eta && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">ETA: {eta.etaText}</span>
                  </div>
                )}
              </div>
              
              <InteractiveMap
                mode="driver"
                driverLocation={driverLocation}
                pickupLocation={rideStatus === 'going_to_pickup' ? activeRide.pickup : null}
                destinationLocation={rideStatus !== 'going_to_pickup' ? activeRide.destination : null}
                onDriverLocationUpdate={handleDriverLocationUpdate}
                onRouteCalculated={handleRouteCalculated}
                center={{ lat: driverLocation.coordinates[1], lng: driverLocation.coordinates[0] }}
                zoom={14}
                height="500px"
              />
            </Card>

            {/* Route Information */}
            {routeData && (
              <div className="mt-6">
                <RouteInfo
                  distance={routeData.distanceText}
                  duration={routeData.durationText}
                  showPricing={false}
                  estimatedArrival={eta?.etaText}
                />
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Passenger Info */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Passager</h3>
                <Button
                  onClick={() => setShowPassengerModal(true)}
                  variant="outline"
                  size="sm"
                >
                  <User className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {activeRide.passenger.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{activeRide.passenger.name}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        {activeRide.passenger.rating} ({activeRide.passenger.totalRides} courses)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => window.open(`tel:${activeRide.passenger.phone}`)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler
                  </Button>
                  <Button
                    onClick={() => window.open(`sms:${activeRide.passenger.phone}`)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    SMS
                  </Button>
                </div>
              </div>
            </Card>

            {/* Trip Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Détails de la course</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Point de départ</p>
                    <p className="text-gray-600 text-sm">{activeRide.pickup.address}</p>
                    {activeRide.pickup.instructions && (
                      <p className="text-xs text-gray-500 mt-1">{activeRide.pickup.instructions}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Destination</p>
                    <p className="text-gray-600 text-sm">{activeRide.destination.address}</p>
                    {activeRide.destination.instructions && (
                      <p className="text-xs text-gray-500 mt-1">{activeRide.destination.instructions}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Passagers</p>
                    <p className="font-medium">{activeRide.passengers}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Prix estimé</p>
                    <p className="font-medium text-green-600">{activeRide.estimatedPrice.toFixed(2)} MAD</p>
                  </div>
                </div>

                {activeRide.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Note du passager</p>
                        <p className="text-sm text-yellow-700">{activeRide.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Action Button */}
            {statusInfo.action && (
              <Button
                onClick={statusInfo.onAction}
                size="lg"
                className="w-full"
                disabled={rideStatus === 'completed'}
              >
                {rideStatus === 'going_to_pickup' && <CheckCircle className="w-5 h-5 mr-2" />}
                {rideStatus === 'waiting_for_passenger' && <PlayCircle className="w-5 h-5 mr-2" />}
                {rideStatus === 'in_progress' && <StopCircle className="w-5 h-5 mr-2" />}
                {statusInfo.action}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Passenger Details Modal */}
      <Modal
        isOpen={showPassengerModal}
        onClose={() => setShowPassengerModal(false)}
        title="Informations passager"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              {activeRide.passenger.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{activeRide.passenger.name}</h3>
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-gray-600">
                  {activeRide.passenger.rating} ({activeRide.passenger.totalRides} courses)
                </span>
              </div>
              <p className="text-gray-600">{activeRide.passenger.phone}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => window.open(`tel:${activeRide.passenger.phone}`)}
              className="flex-1"
            >
              <Phone className="w-4 h-4 mr-2" />
              Appeler
            </Button>
            <Button
              onClick={() => window.open(`sms:${activeRide.passenger.phone}`)}
              variant="outline"
              className="flex-1"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Envoyer SMS
            </Button>
          </div>
        </div>
      </Modal>

      {/* Complete Trip Modal */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Terminer la course"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Confirmez-vous que le passager est arrivé à destination et que la course est terminée ?
          </p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Durée:</span>
                <p className="font-medium">{formatTimer(tripTimer)}</p>
              </div>
              <div>
                <span className="text-gray-600">Prix:</span>
                <p className="font-medium text-green-600">{activeRide.estimatedPrice.toFixed(2)} MAD</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes sur la course (optionnel)
            </label>
            <textarea
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows="3"
              placeholder="Ajouter des notes..."
            />
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => setShowCompleteModal(false)}
              variant="outline"
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={confirmCompleteTrip}
              className="flex-1"
            >
              Confirmer la fin
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default DriverActiveRidePage
