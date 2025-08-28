"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Star, MessageCircle, Car, MapPin, ArrowLeft, CheckCircle } from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Loading from "../../components/ui/Loading"
import { useRide } from "../../hooks/useRide"
import { formatCurrency, formatDate } from "../../utils/helpers"
import { toast } from "react-hot-toast"

const RideRatingPage = () => {
  const { rideId } = useParams()
  const navigate = useNavigate()
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const { rateRide } = useRide()

  useEffect(() => {
    // Simulation de récupération des détails de la course
    const fetchRideDetails = async () => {
      try {
        // Ici vous feriez un appel API réel
        const mockRide = {
          _id: rideId,
          pickup: {
            address: "123 Rue Mohammed V, Casablanca",
          },
          destination: {
            address: "Aéroport Mohammed V, Nouaceur",
          },
          price: {
            total: 40,
          },
          createdAt: new Date().toISOString(),
          driver: {
            _id: "driver1",
            firstName: "Ahmed",
            lastName: "Ben Ali",
            rating: 4.8,
            totalRides: 1250,
            vehicle: {
              make: "Toyota",
              model: "Corolla",
              color: "Blanc",
              licensePlate: "123456-A-78",
            },
          },
          rating: null, // Pas encore noté
        }

        setRide(mockRide)
      } catch (error) {
        toast.error("Erreur lors du chargement")
        navigate("/ride/history")
      } finally {
        setLoading(false)
      }
    }

    fetchRideDetails()
  }, [rideId, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error("Veuillez sélectionner une note")
      return
    }

    setSubmitting(true)
    try {
      await rateRide(ride._id, rating, comment)
      setSubmitted(true)
      toast.success("Merci pour votre évaluation !")

      // Redirection après 3 secondes
      setTimeout(() => {
        navigate("/ride/history")
      }, 3000)
    } catch (error) {
      toast.error("Erreur lors de l'envoi de la note")
    } finally {
      setSubmitting(false)
    }
  }

  const ratingLabels = {
    1: "Très insatisfait",
    2: "Insatisfait",
    3: "Correct",
    4: "Satisfait",
    5: "Excellent",
  }

  const ratingDescriptions = {
    1: "Service très décevant",
    2: "Service en dessous des attentes",
    3: "Service acceptable",
    4: "Bon service, je recommande",
    5: "Service exceptionnel !",
  }

  if (loading) return <Loading />

  if (!ride) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Course introuvable</h2>
        <p className="text-gray-600 mb-6">Cette course n'existe pas ou a déjà été notée</p>
        <Button onClick={() => navigate("/ride/history")}>Retour à l'historique</Button>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-12 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Merci pour votre évaluation !</h2>
          <p className="text-gray-600 mb-8">Votre note a été enregistrée et aidera à améliorer nos services.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/ride/history")}>Retour à l'historique</Button>
            <Button variant="outline" onClick={() => navigate("/ride/request")} className="bg-transparent">
              Nouvelle course
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* En-tête */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/ride/history")}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Évaluer votre course</h1>
          <p className="text-gray-600">Votre avis nous aide à améliorer nos services</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire de notation */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations du chauffeur */}
              <div className="text-center">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {ride.driver.firstName.charAt(0)}
                    {ride.driver.lastName.charAt(0)}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  {ride.driver.firstName} {ride.driver.lastName}
                </h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{ride.driver.rating}</span>
                  <span className="text-gray-500">({ride.driver.totalRides} courses)</span>
                </div>
                <p className="text-gray-600">
                  {ride.driver.vehicle.make} {ride.driver.vehicle.model} • {ride.driver.vehicle.color}
                </p>
              </div>

              {/* Notation par étoiles */}
              <div className="text-center">
                <h4 className="text-xl font-semibold mb-4">Comment évaluez-vous cette course ?</h4>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none transition-all hover:scale-110"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className={`w-12 h-12 ${
                          star <= (hoveredRating || rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {(hoveredRating || rating) > 0 && (
                  <div className="text-center">
                    <p className="text-xl font-semibold text-primary mb-2">{ratingLabels[hoveredRating || rating]}</p>
                    <p className="text-gray-600">{ratingDescriptions[hoveredRating || rating]}</p>
                  </div>
                )}
              </div>

              {/* Commentaire */}
              <div>
                <label className="block text-lg font-semibold mb-4">
                  <MessageCircle className="w-5 h-5 inline mr-2" />
                  Commentaire (optionnel)
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows="5"
                  placeholder="Partagez votre expérience avec ce chauffeur..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500 mt-2">{comment.length}/500 caractères</div>
              </div>

              {/* Suggestions de commentaires */}
              {rating > 0 && (
                <div>
                  <p className="font-medium mb-3">Suggestions de commentaires :</p>
                  <div className="flex flex-wrap gap-2">
                    {rating >= 4
                      ? [
                          "Chauffeur très professionnel",
                          "Véhicule propre et confortable",
                          "Conduite sécurisée",
                          "Très ponctuel",
                          "Service excellent",
                        ]
                      : [
                          "Peut mieux faire",
                          "Retard important",
                          "Véhicule pas très propre",
                          "Conduite un peu brusque",
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                            onClick={() => setComment((prev) => (prev ? `${prev}. ${suggestion}` : suggestion))}
                          >
                            {suggestion}
                          </button>
                        ))}
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => navigate("/ride/history")}
                >
                  Passer
                </Button>
                <Button type="submit" loading={submitting} disabled={rating === 0} className="flex-1">
                  Envoyer l'évaluation
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar - Détails de la course */}
        <div className="space-y-6">
          {/* Résumé de la course */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Résumé de la course</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Départ</p>
                  <p className="text-sm text-gray-600">{ride.pickup.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Destination</p>
                  <p className="text-sm text-gray-600">{ride.destination.address}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span>Prix total</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(ride.price.total)}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">{formatDate(ride.createdAt)}</div>
              </div>
            </div>
          </Card>

          {/* Informations du véhicule */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Véhicule</h3>
            <div className="flex items-center gap-3">
              <Car className="w-8 h-8 text-gray-600" />
              <div>
                <p className="font-semibold">
                  {ride.driver.vehicle.make} {ride.driver.vehicle.model}
                </p>
                <p className="text-sm text-gray-600">
                  {ride.driver.vehicle.color} • {ride.driver.vehicle.licensePlate}
                </p>
              </div>
            </div>
          </Card>

          {/* Conseils */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold mb-3 text-blue-800">Pourquoi noter ?</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Aide les autres passagers</li>
              <li>• Améliore la qualité du service</li>
              <li>• Récompense les bons chauffeurs</li>
              <li>• Contribue à la communauté</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RideRatingPage
