"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { MapPin, Clock, Car, CreditCard, Users, Calendar, ArrowRight, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Card from "../../components/ui/Card"
import { useRide } from "../../hooks/useRide"
import { useGeolocation } from "../../hooks/useGeolocation"
import { VEHICLE_TYPES, PAYMENT_METHODS } from "../../utils/constants"
import { formatCurrency } from "../../utils/helpers"

const RideRequestPage = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [estimatedPrice, setEstimatedPrice] = useState(null)
  const [estimatedTime, setEstimatedTime] = useState(null)
  const [availableDrivers, setAvailableDrivers] = useState([])
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

  useEffect(() => {
    if (location) {
      setValue("pickupLat", location.latitude)
      setValue("pickupLng", location.longitude)
    }
  }, [location, setValue])

  // Simulation du calcul de prix
  useEffect(() => {
    if (watchedValues.pickup && watchedValues.destination) {
      const basePrice = 5
      const distancePrice = Math.random() * 20 + 5
      const typeMultiplier = {
        economy: 1,
        standard: 1.2,
        premium: 1.5,
        suv: 1.8,
      }
      const total = (basePrice + distancePrice) * typeMultiplier[watchedValues.vehicleType]
      setEstimatedPrice(total)
      setEstimatedTime(Math.floor(Math.random() * 20) + 5)

      // Simulation des chauffeurs disponibles
      setAvailableDrivers([
        { id: 1, name: "Ahmed Ben Ali", rating: 4.8, distance: "2 min", vehicle: "Toyota Corolla" },
        { id: 2, name: "Fatima Zahra", rating: 4.9, distance: "5 min", vehicle: "Hyundai Accent" },
        { id: 3, name: "Mohamed Taha", rating: 4.7, distance: "8 min", vehicle: "Renault Logan" },
      ])
    }
  }, [watchedValues.pickup, watchedValues.destination, watchedValues.vehicleType])

  const onSubmit = async (data) => {
    try {
      const geocodeIfMissing = async (address, lat, lng) => {
        if ((lat === undefined || lat === null || lat === "") || (lng === undefined || lng === null || lng === "")) {
          if (!address) return null
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
          const res = await fetch(url, { headers: { "Accept": "application/json" } })
          const json = await res.json()
          if (Array.isArray(json) && json.length > 0) {
            return { lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) }
          }
          return null
        }
        return { lat: parseFloat(lat), lng: parseFloat(lng) }
      }

      const pickupCoords = await geocodeIfMissing(data.pickup, data.pickupLat, data.pickupLng)
      const destinationCoords = await geocodeIfMissing(data.destination, data.destinationLat, data.destinationLng)

      if (!pickupCoords || !destinationCoords) {
        toast.error("Adresse invalide. Veuillez vérifier le départ et la destination.")
        return
      }

      const rideData = {
        pickup: {
          address: data.pickup,
          location: {
            type: "Point",
            coordinates: [pickupCoords.lng, pickupCoords.lat],
          },
        },
        destination: {
          address: data.destination,
          location: {
            type: "Point",
            coordinates: [destinationCoords.lng, destinationCoords.lat],
          },
        },
        vehicleType: data.vehicleType,
        passengers: Number.parseInt(data.passengers),
        paymentMethod: data.paymentMethod,
        scheduledTime: data.scheduledTime || null,
        notes: data.notes || "",
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Indicateur de progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            return (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentStep >= step.number ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <StepIcon className="w-6 h-6" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${currentStep > step.number ? "bg-primary" : "bg-gray-200"}`} />
                )}
              </div>
            )
          })}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{steps[currentStep - 1].title}</h2>
          <p className="text-gray-600">
            Étape {currentStep} sur {steps.length}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Étape 1: Destination */}
        {currentStep === 1 && (
          <Card className="p-8">
            <div className="space-y-6">
              <div className="relative">
                <Input
                  label="Point de départ"
                  placeholder="Entrez l'adresse de départ"
                  icon={<MapPin className="w-5 h-5 text-green-500" />}
                  error={errors.pickup?.message}
                  {...register("pickup", { required: "Le point de départ est requis" })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-8"
                  onClick={getCurrentLocation}
                >
                  Ma position
                </Button>
              </div>

              <Input
                label="Destination"
                placeholder="Où souhaitez-vous aller ?"
                icon={<MapPin className="w-5 h-5 text-red-500" />}
                error={errors.destination?.message}
                {...register("destination", { required: "La destination est requise" })}
              />

              <input type="hidden" {...register("pickupLat")} />
              <input type="hidden" {...register("pickupLng")} />
              <input type="hidden" {...register("destinationLat")} />
              <input type="hidden" {...register("destinationLng")} />

              {/* Suggestions d'adresses récentes */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Adresses récentes</h4>
                <div className="space-y-2">
                  {["Aéroport Mohammed V", "Gare Casa-Port", "Twin Center"].map((address) => (
                    <button
                      key={address}
                      type="button"
                      className="w-full text-left p-2 hover:bg-white rounded transition-colors"
                      onClick={() => setValue("destination", address)}
                    >
                      <MapPin className="w-4 h-4 inline mr-2 text-gray-400" />
                      {address}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Étape 2: Type de véhicule */}
        {currentStep === 2 && (
          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vehicleOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    relative flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all
                    ${
                      watchedValues.vehicleType === option.value
                        ? "border-primary bg-primary bg-opacity-10"
                        : "border-gray-200 hover:border-primary hover:bg-primary hover:bg-opacity-5"
                    }
                  `}
                >
                  <input
                    type="radio"
                    value={option.value}
                    className="sr-only"
                    {...register("vehicleType", { required: "Veuillez sélectionner un type de véhicule" })}
                  />
                  <div className="text-4xl mb-3">{option.icon}</div>
                  <div className="text-lg font-semibold mb-1">{option.label}</div>
                  <div className="text-sm text-gray-600 text-center mb-3">{option.description}</div>
                  {estimatedPrice && (
                    <div className="text-lg font-bold text-primary">
                      {formatCurrency(estimatedPrice * option.multiplier)}
                    </div>
                  )}
                </label>
              ))}
            </div>

            {/* Chauffeurs disponibles */}
            {availableDrivers.length > 0 && (
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Chauffeurs disponibles</h4>
                <div className="space-y-3">
                  {availableDrivers.map((driver) => (
                    <div key={driver.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                          {driver.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{driver.name}</div>
                          <div className="text-sm text-gray-600">{driver.vehicle}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm font-medium">{driver.rating}</span>
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

        {/* Étape 3: Détails */}
        {currentStep === 3 && (
          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre de passagers</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                <label className="block text-sm font-medium mb-2">Méthode de paiement</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register("paymentMethod")}
                >
                  <option value={PAYMENT_METHODS.CASH}>Espèces</option>
                  <option value={PAYMENT_METHODS.CARD}>Carte bancaire</option>
                  <option value={PAYMENT_METHODS.PAYPAL}>PayPal</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <Input
                label="Programmer pour plus tard (Optionnel)"
                type="datetime-local"
                icon={<Calendar className="w-5 h-5" />}
                {...register("scheduledTime")}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Instructions spéciales (Optionnel)</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows="4"
                placeholder="Instructions pour le chauffeur..."
                {...register("notes")}
              />
            </div>
          </Card>
        )}

        {/* Étape 4: Confirmation */}
        {currentStep === 4 && (
          <Card className="p-8">
            <h3 className="text-xl font-semibold mb-6">Récapitulatif de votre course</h3>

            <div className="space-y-6">
              {/* Itinéraire */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <MapPin className="w-5 h-5 text-green-500" />
                    <div className="w-px h-8 bg-gray-300 my-2"></div>
                    <MapPin className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <div className="font-medium">Départ</div>
                      <div className="text-gray-600">{watchedValues.pickup}</div>
                    </div>
                    <div>
                      <div className="font-medium">Destination</div>
                      <div className="text-gray-600">{watchedValues.destination}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Détails */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Car className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-medium capitalize">{watchedValues.vehicleType}</div>
                  <div className="text-sm text-gray-600">Véhicule</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-medium">{watchedValues.passengers}</div>
                  <div className="text-sm text-gray-600">Passagers</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-medium">{estimatedTime} min</div>
                  <div className="text-sm text-gray-600">Durée</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-medium capitalize">{watchedValues.paymentMethod}</div>
                  <div className="text-sm text-gray-600">Paiement</div>
                </div>
              </div>

              {/* Prix */}
              {estimatedPrice && (
                <div className="bg-primary bg-opacity-10 border border-primary rounded-lg p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-semibold">Prix estimé</div>
                      <div className="text-sm text-gray-600">Temps d'arrivée: {estimatedTime} minutes</div>
                    </div>
                    <div className="text-3xl font-bold text-primary">{formatCurrency(estimatedPrice)}</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Boutons de navigation */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            icon={<ArrowLeft className="w-4 h-4 bg-transparent" />}
            className="bg-transparent"
          >
            Précédent
          </Button>

          {currentStep < 4 ? (
            <Button type="button" onClick={nextStep} icon={<ArrowRight className="w-4 h-4" />}>
              Suivant
            </Button>
          ) : (
            <Button type="submit" loading={loading} size="lg" icon={<Car className="w-5 h-5" />}>
              {watchedValues.scheduledTime ? "Programmer la course" : "Demander maintenant"}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

export default RideRequestPage
