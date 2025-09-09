import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { MapPin, Clock, Car, CreditCard, Users, Calendar, ArrowRight, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Card from "../../components/ui/Card"
import InteractiveMap from "../../components/Map/InteractiveMap"
import LocationSearch from "../../components/Map/LocationSearch"
import RouteInfo from "../../components/Map/RouteInfo"
import { useRide } from "../../hooks/useRide"
import { useGeolocation } from "../../hooks/useGeolocation"
import { VEHICLE_TYPES, PAYMENT_METHODS } from "../../utils/constants"
import { formatCurrency } from "../../utils/helpers"
import { calculatePrice } from "../../utils/mapsClient"

const RideRequestPage = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [pickupLocation, setPickupLocation] = useState(null)
  const [destinationLocation, setDestinationLocation] = useState(null)
  const [routeInfo, setRouteInfo] = useState(null)
  const [estimatedPrice, setEstimatedPrice] = useState(null)
  const [availableDrivers, setAvailableDrivers] = useState([])
  const [mapLoading, setMapLoading] = useState(false)
  const { requestRide, loading } = useRide()
  const { location, getCurrentLocation } = useGeolocation()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      vehicleType: VEHICLE_TYPES.STANDARD,
      passengers: 1,
      paymentMethod: PAYMENT_METHODS.CASH,
    },
  })

  const watchedValues = watch()

  // Handle location selection from map or search
  const handleLocationSelect = (type, location) => {
    if (type === 'pickup') {
      setPickupLocation(location)
      setValue('pickup', location?.address || '')
      setValue('pickupLat', location?.coordinates?.[1] || '')
      setValue('pickupLng', location?.coordinates?.[0] || '')
    } else if (type === 'destination') {
      setDestinationLocation(location)
      setValue('destination', location?.address || '')
      setValue('destinationLat', location?.coordinates?.[1] || '')
      setValue('destinationLng', location?.coordinates?.[0] || '')
    }
  }

  // Handle route calculation
  const handleRouteCalculated = (routeData) => {
    setRouteInfo(routeData)
    
    // Calculate price based on distance and duration
    if (routeData.distance && routeData.duration) {
      const priceData = calculatePrice(
        routeData.distance, 
        routeData.duration, 
        watchedValues.vehicleType
      )
      setEstimatedPrice(priceData)
    }
  }

  // Set current location as pickup
  useEffect(() => {
    if (location && !pickupLocation) {
      const currentLocationData = {
        coordinates: [location.longitude, location.latitude],
        address: "Current Location",
        type: 'pickup'
      }
      setPickupLocation(currentLocationData)
      setValue('pickup', 'Current Location')
      setValue('pickupLat', location.latitude)
      setValue('pickupLng', location.longitude)
    }
  }, [location, pickupLocation, setValue])

  // Update price when vehicle type changes
  useEffect(() => {
    if (routeInfo?.distance && routeInfo?.duration) {
      const priceData = calculatePrice(
        routeInfo.distance, 
        routeInfo.duration, 
        watchedValues.vehicleType
      )
      setEstimatedPrice(priceData)
    }
  }, [watchedValues.vehicleType, routeInfo])

  // Simulate available drivers when route is calculated
  useEffect(() => {
    if (routeInfo) {
      setAvailableDrivers([
        { id: 1, name: "Ahmed Ben Ali", rating: 4.8, distance: "2 min", vehicle: "Toyota Corolla" },
        { id: 2, name: "Fatima Zahra", rating: 4.9, distance: "5 min", vehicle: "Hyundai Accent" },
        { id: 3, name: "Mohamed Taha", rating: 4.7, distance: "8 min", vehicle: "Renault Logan" },
      ])
    }
  }, [routeInfo])

  const onSubmit = async (data) => {
    try {
      if (!pickupLocation?.coordinates || !destinationLocation?.coordinates) {
        toast.error("Please select both pickup and destination locations")
        return
      }

      const rideData = {
        pickup: {
          address: pickupLocation.address,
          location: {
            type: "Point",
            coordinates: pickupLocation.coordinates,
          },
        },
        destination: {
          address: destinationLocation.address,
          location: {
            type: "Point",
            coordinates: destinationLocation.coordinates,
          },
        },
        vehicleType: data.vehicleType,
        passengers: Number.parseInt(data.passengers),
        paymentMethod: data.paymentMethod,
        scheduledTime: data.scheduledTime || null,
        notes: data.notes || "",
        estimatedPrice: estimatedPrice?.total || null,
        estimatedDuration: routeInfo?.duration || null,
        estimatedDistance: routeInfo?.distance || null,
      }

      const result = await requestRide(rideData)
      toast.success("Course demandée avec succès!")
      const newRideId = result?.ride?._id || result?._id
      navigate(`/ride/tracking/${newRideId}`)
    } catch (error) {
      toast.error(error.message || "Erreur lors de la demande")
    }
  }

  const nextStep = async () => {
    if (currentStep === 1 && (!pickupLocation || !destinationLocation)) {
      toast.error("Please select both pickup and destination locations")
      return
    }
    
    const isValid = await trigger()
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const vehicleOptions = [
    {
      value: VEHICLE_TYPES.ECONOMY,
      label: "Économique",
      icon: "🚗",
      description: "Option abordable",
      multiplier: 1,
    },
    {
      value: VEHICLE_TYPES.STANDARD,
      label: "Standard",
      icon: "🚙",
      description: "Confort optimal",
      multiplier: 1.2,
    },
    {
      value: VEHICLE_TYPES.PREMIUM,
      label: "Premium",
      icon: "🚘",
      description: "Expérience luxe",
      multiplier: 1.5,
    },
    {
      value: VEHICLE_TYPES.SUV,
      label: "SUV",
      icon: "🚐",
      description: "Espace supplémentaire",
      multiplier: 1.8,
    },
  ]

  const steps = [
    { number: 1, title: "Destination", icon: MapPin },
    { number: 2, title: "Véhicule", icon: Car },
    { number: 3, title: "Détails", icon: Users },
    { number: 4, title: "Confirmation", icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Modern Progress Indicator */}
        <div className="mb-8">
          {/* Mobile Progress Indicator */}
          <div className="block md:hidden mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-2">
                {steps.map((step, index) => {
                  const StepIcon = step.icon
                  const isActive = currentStep === step.number
                  const isCompleted = currentStep > step.number
                  const isVisible = currentStep >= step.number
                  
                  if (!isVisible) return null
                  
                  return (
                    <div key={step.number} className="flex items-center">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted 
                            ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg" 
                            : isActive 
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-110" 
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <StepIcon className="w-7 h-7" />
                      </div>
                      {index < steps.length - 1 && currentStep > step.number && (
                        <div className={`w-8 h-1 mx-2 transition-all duration-300 ${
                          isCompleted ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gray-200"
                        }`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{steps[currentStep - 1].title}</h2>
              <p className="text-gray-600 text-sm">
                Étape {currentStep} sur {steps.length}
              </p>
            </div>
          </div>

          {/* Desktop Progress Indicator */}
          <div className="hidden md:block">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => {
                  const StepIcon = step.icon
                  const isActive = currentStep === step.number
                  const isCompleted = currentStep > step.number
                  const isVisible = currentStep >= step.number
                  
                  if (!isVisible) return null
                  
                  return (
                    <div key={step.number} className="flex items-center">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted 
                            ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg" 
                            : isActive 
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-110" 
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <StepIcon className="w-6 h-6" />
                      </div>
                      {index < steps.length - 1 && currentStep > step.number && (
                        <div className={`w-20 h-1 mx-3 transition-all duration-300 ${
                          isCompleted ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gray-200"
                        }`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{steps[currentStep - 1].title}</h2>
              <p className="text-gray-600 text-lg">
                Étape {currentStep} sur {steps.length}
              </p>
            </div>
          </div>
        </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Destination with Interactive Map */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Search inputs */}
            <Card className="p-8 border-0 shadow-xl">
              <div className="space-y-8">
                <div className="relative">
                  <label className="block text-lg font-semibold text-gray-900 mb-3">Point de départ</label>
                  <LocationSearch
                    placeholder="Entrez l'adresse de départ"
                    value={pickupLocation?.address || ''}
                    onLocationSelect={(location) => handleLocationSelect('pickup', location)}
                    icon={<MapPin className="w-5 h-5 text-green-500" />}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 bg-transparent border-orange-200 text-orange-600 hover:bg-orange-50"
                    onClick={getCurrentLocation}
                  >
                    📍 Utiliser ma position actuelle
                  </Button>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">Destination</label>
                  <LocationSearch
                    placeholder="Où souhaitez-vous aller ?"
                    value={destinationLocation?.address || ''}
                    onLocationSelect={(location) => handleLocationSelect('destination', location)}
                    icon={<MapPin className="w-5 h-5 text-red-500" />}
                  />
                </div>

                <input type="hidden" {...register("pickup")} />
                <input type="hidden" {...register("destination")} />
                <input type="hidden" {...register("pickupLat")} />
                <input type="hidden" {...register("pickupLng")} />
                <input type="hidden" {...register("destinationLat")} />
                <input type="hidden" {...register("destinationLng")} />

                {/* Route information */}
                {routeInfo && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <RouteInfo
                      distance={routeInfo.distanceText}
                      duration={routeInfo.durationText}
                      price={estimatedPrice?.formattedTotal}
                      loading={mapLoading}
                    />
                  </div>
                )}

                {/* Recent addresses */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    Adresses récentes
                  </h4>
                  <div className="space-y-3">
                    {["Aéroport Mohammed V", "Gare Casa-Port", "Twin Center"].map((address) => (
                      <button
                        key={address}
                        type="button"
                        className="w-full text-left p-4 hover:bg-white rounded-lg transition-all duration-200 border border-transparent hover:border-orange-200 hover:shadow-sm"
                        onClick={() => {
                          const location = { address, coordinates: null }
                          handleLocationSelect('destination', location)
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{address}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Right side - Interactive Map */}
            <Card className="p-6 border-0 shadow-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-orange-500" />
                Sélectionnez sur la carte
              </h3>
              <InteractiveMap
                mode="passenger"
                onLocationSelect={handleLocationSelect}
                onRouteCalculated={handleRouteCalculated}
                center={{ lat: 33.5731, lng: -7.5898 }}
                zoom={12}
                height="500px"
                pickupLocation={pickupLocation}
                destinationLocation={destinationLocation}
              />
            </Card>
          </div>
        )}

        {/* Step 2: Vehicle type */}
        {currentStep === 2 && (
          <Card className="p-8 border-0 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Choisissez votre véhicule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vehicleOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    relative flex flex-col items-center p-8 border-2 rounded-2xl cursor-pointer transition-all duration-300 group
                    ${
                      watchedValues.vehicleType === option.value
                        ? "border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg scale-105"
                        : "border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:shadow-md"
                    }
                  `}
                >
                  <input
                    type="radio"
                    value={option.value}
                    className="sr-only"
                    {...register("vehicleType", { required: "Veuillez sélectionner un type de véhicule" })}
                  />
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{option.icon}</div>
                  <div className="text-xl font-bold mb-2 text-gray-900">{option.label}</div>
                  <div className="text-gray-600 text-center mb-4">{option.description}</div>
                  {estimatedPrice && (
                    <div className="text-2xl font-bold text-orange-600">
                      {calculatePrice(routeInfo?.distance || 0, routeInfo?.duration || 0, option.value).formattedTotal}
                    </div>
                  )}
                  {watchedValues.vehicleType === option.value && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </label>
              ))}
            </div>

            {/* Available drivers */}
            {availableDrivers.length > 0 && (
              <div className="mt-12">
                <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">Chauffeurs disponibles</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {availableDrivers.map((driver) => (
                    <div key={driver.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {driver.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{driver.name}</div>
                          <div className="text-sm text-gray-600">{driver.vehicle}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-yellow-400 text-lg">★</span>
                          <span className="font-semibold text-gray-900">{driver.rating}</span>
                        </div>
                        <div className="text-sm text-gray-600">{driver.distance}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Step 3: Details */}
        {currentStep === 3 && (
          <Card className="p-8 border-0 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Détails de votre course</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">Nombre de passagers</label>
                <select
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-lg"
                  {...register("passengers", { required: "Sélectionnez le nombre de passagers" })}
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Passager" : "Passagers"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">Méthode de paiement</label>
                <select
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-lg"
                  {...register("paymentMethod")}
                >
                  <option value={PAYMENT_METHODS.CASH}>💵 Espèces</option>
                  <option value={PAYMENT_METHODS.CARD}>💳 Carte bancaire</option>
                  <option value={PAYMENT_METHODS.PAYPAL}>🅿️ PayPal</option>
                </select>
              </div>
            </div>

            <div className="mt-8">
              <Input
                label="Programmer pour plus tard (Optionnel)"
                type="datetime-local"
                icon={<Calendar className="w-5 h-5" />}
                {...register("scheduledTime")}
              />
            </div>

            <div className="mt-8">
              <label className="block text-lg font-semibold text-gray-900 mb-3">Instructions spéciales (Optionnel)</label>
              <textarea
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none bg-gray-50"
                rows="4"
                placeholder="Instructions pour le chauffeur..."
                {...register("notes")}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                icon={<ArrowLeft className="w-4 h-4" />}
                className="bg-transparent border-gray-300 text-gray-600 hover:bg-gray-50 px-8 py-4 text-lg"
              >
                Précédent
              </Button>

              <Button 
                type="button" 
                onClick={() => setCurrentStep(4)}
                icon={<CreditCard className="w-5 h-5" />}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-12 py-4 text-xl shadow-xl"
              >
                Voir le récapitulatif
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <Card className="p-8 border-0 shadow-xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Récapitulatif de votre course</h3>

            <div className="space-y-8">
              {/* Route */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  Itinéraire
                </h4>
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-px h-12 bg-gray-300 my-3"></div>
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Départ</div>
                      <div className="text-lg font-semibold text-gray-900">{pickupLocation?.address || 'Non sélectionné'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Destination</div>
                      <div className="text-lg font-semibold text-gray-900">{destinationLocation?.address || 'Non sélectionné'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Vehicle Type - Blue */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <Car className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <div className="font-bold text-lg capitalize text-blue-900">{watchedValues.vehicleType}</div>
                  <div className="text-sm text-blue-700">Véhicule</div>
                </div>
                
                {/* Passengers - Green */}
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <Users className="w-8 h-8 mx-auto mb-3 text-green-600" />
                  <div className="font-bold text-lg text-green-900">{watchedValues.passengers}</div>
                  <div className="text-sm text-green-700">Passagers</div>
                </div>
                
                {/* Duration - Orange */}
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <Clock className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                  <div className="font-bold text-lg text-orange-900">{routeInfo?.durationText || 'N/A'}</div>
                  <div className="text-sm text-orange-700">Durée</div>
                </div>
                
                {/* Payment - Purple */}
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <CreditCard className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                  <div className="font-bold text-lg capitalize text-purple-900">{watchedValues.paymentMethod}</div>
                  <div className="text-sm text-purple-700">Paiement</div>
                </div>
              </div>

              {/* Final price */}
              {estimatedPrice && (
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">Prix estimé</div>
                      <div className="text-gray-600 mt-2">
                        Distance: {routeInfo?.distanceText} • Durée: {routeInfo?.durationText}
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-orange-600">{estimatedPrice.formattedTotal}</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-12">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            icon={<ArrowLeft className="w-4 h-4" />}
            className="bg-transparent border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 text-lg"
          >
            Précédent
          </Button>

          {currentStep < 3 ? (
            <Button 
              type="button" 
              onClick={nextStep} 
              icon={<ArrowRight className="w-4 h-4" />}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-4 text-lg shadow-lg"
            >
              Suivant
            </Button>
          ) : currentStep === 4 ? (
            <Button 
              type="submit" 
              loading={loading} 
              size="lg" 
              icon={<Car className="w-5 h-5" />}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-12 py-4 text-xl shadow-xl"
            >
              {watchedValues.scheduledTime ? "Programmer la course" : "Demander maintenant"}
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  </div>
  )
}

export default RideRequestPage
