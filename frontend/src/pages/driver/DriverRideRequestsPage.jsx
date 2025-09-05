import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  User, 
  Star, 
  Car,
  Navigation,
  Phone,
  MessageSquare,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import InteractiveMap from '../../components/Map/InteractiveMap';
import { useAuth } from '../../hooks/useAuth';
import { useGeolocation } from '../../hooks/useGeolocation';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatDistance } from '../../utils/helpers';
import { calculateHaversineDistance } from '../../utils/mapsClient';

const DriverRideRequestsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { location, getCurrentLocation } = useGeolocation();
  const [driverLocation, setDriverLocation] = useState(null);
  const [nearbyRides, setNearbyRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    maxDistance: 5, // 5km par défaut
    minPrice: 0,
    vehicleType: 'all'
  });

  // Simulated ride requests (à remplacer par des vraies données de l'API)
  const mockRideRequests = [
    {
      id: 1,
      passenger: {
        name: 'Ahmed Bennani',
        rating: 4.8,
        phone: '+212 6 12 34 56 78',
        avatar: null
      },
      pickup: {
        address: 'Avenue Mohammed V, Casablanca',
        coordinates: [-7.5898, 33.5731]
      },
      destination: {
        address: 'Aéroport Mohammed V, Nouaceur',
        coordinates: [-7.5300, 33.3675]
      },
      distance: 28.5,
      duration: 35,
      estimatedPrice: 145.50,
      vehicleType: 'standard',
      passengers: 2,
      scheduledTime: null,
      notes: 'Vol à 14h30, merci d\'être ponctuel',
      requestTime: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
    },
    {
      id: 2,
      passenger: {
        name: 'Fatima Zahra',
        rating: 4.9,
        phone: '+212 6 87 65 43 21',
        avatar: null
      },
      pickup: {
        address: 'Twin Center, Casablanca',
        coordinates: [-7.5850, 33.5950]
      },
      destination: {
        address: 'Université Hassan II, Casablanca',
        coordinates: [-7.6400, 33.5650]
      },
      distance: 8.2,
      duration: 15,
      estimatedPrice: 35.75,
      vehicleType: 'economy',
      passengers: 1,
      scheduledTime: null,
      notes: '',
      requestTime: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
    },
    {
      id: 3,
      passenger: {
        name: 'Omar Tazi',
        rating: 4.6,
        phone: '+212 6 55 44 33 22',
        avatar: null
      },
      pickup: {
        address: 'Gare Casa-Port, Casablanca',
        coordinates: [-7.6150, 33.5950]
      },
      destination: {
        address: 'Marina de Casablanca',
        coordinates: [-7.6100, 33.6050]
      },
      distance: 3.5,
      duration: 8,
      estimatedPrice: 22.50,
      vehicleType: 'standard',
      passengers: 1,
      scheduledTime: new Date(Date.now() + 30 * 60 * 1000), // dans 30 minutes
      notes: 'Rendez-vous d\'affaires important',
      requestTime: new Date(Date.now() - 1 * 60 * 1000) // 1 minute ago
    }
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      setDriverLocation({
        coordinates: [location.longitude, location.latitude],
        address: 'Ma position actuelle'
      });
    }
  }, [location]);

  useEffect(() => {
    if (driverLocation) {
      loadNearbyRides();
    }
  }, [driverLocation, filters]);

  const loadNearbyRides = () => {
    if (!driverLocation?.coordinates) return;

    setIsLoading(true);
    
    // Simuler un délai d'API
    setTimeout(() => {
      const filteredRides = mockRideRequests.filter(ride => {
        if (!ride.pickup?.coordinates) return false;

        // Calculer la distance entre le chauffeur et le point de départ
        const distance = calculateHaversineDistance(
          driverLocation.coordinates,
          ride.pickup.coordinates
        ) / 1000; // Convertir en km

        // Filtrer par distance max
        if (distance > filters.maxDistance) return false;

        // Filtrer par prix minimum
        if (ride.estimatedPrice < filters.minPrice) return false;

        // Filtrer par type de véhicule
        if (filters.vehicleType !== 'all' && ride.vehicleType !== filters.vehicleType) return false;

        // Ajouter la distance calculée
        ride.distanceFromDriver = distance;

        return true;
      }).sort((a, b) => a.distanceFromDriver - b.distanceFromDriver);

      setNearbyRides(filteredRides);
      setIsLoading(false);
    }, 1000);
  };

  const handleRideSelect = (ride) => {
    setSelectedRide(ride);
  };

  const handleAcceptRide = async (rideId) => {
    try {
      setIsLoading(true);
      // Simuler l'acceptation de la course
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Course acceptée avec succès!');
      navigate(`/driver/rides/${rideId}`);
    } catch (error) {
      toast.error('Erreur lors de l\'acceptation de la course');
      setIsLoading(false);
    }
  };

  const handleRejectRide = (rideId) => {
    setNearbyRides(prev => prev.filter(ride => ride.id !== rideId));
    if (selectedRide?.id === rideId) {
      setSelectedRide(null);
    }
    toast.success('Course refusée');
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `Il y a ${diffInHours}h`;
  };

  const getVehicleTypeLabel = (type) => {
    const types = {
      economy: 'Économique',
      standard: 'Standard',
      premium: 'Premium',
      suv: 'SUV'
    };
    return types[type] || type;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-dark">Demandes de course</h1>
          <p className="text-text-secondary">
            {nearbyRides.length} demande{nearbyRides.length !== 1 ? 's' : ''} dans un rayon de {filters.maxDistance}km
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={loadNearbyRides}
            disabled={isLoading}
            icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Actualiser
          </Button>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-secondary" />
            <select
              value={filters.maxDistance}
              onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: Number(e.target.value) }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value={1}>1 km</option>
              <option value={3}>3 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={20}>20 km</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des demandes */}
        <div className="lg:col-span-1">
          <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : nearbyRides.length === 0 ? (
              <Card className="p-6 text-center">
                <Car className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="font-semibold text-text-dark mb-2">Aucune demande</h3>
                <p className="text-text-secondary text-sm">
                  Aucune demande de course dans votre zone. Essayez d'augmenter le rayon de recherche.
                </p>
              </Card>
            ) : (
              nearbyRides.map((ride) => (
                <Card 
                  key={ride.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                    selectedRide?.id === ride.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleRideSelect(ride)}
                >
                  {/* Header avec passager et temps */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {ride.passenger.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-text-dark">{ride.passenger.name}</div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-text-secondary">{ride.passenger.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{formatCurrency(ride.estimatedPrice)}</div>
                      <div className="text-xs text-text-secondary">{formatTimeAgo(ride.requestTime)}</div>
                    </div>
                  </div>

                  {/* Itinéraire */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-text-dark truncate">{ride.pickup.address}</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-text-dark truncate">{ride.destination.address}</div>
                    </div>
                  </div>

                  {/* Détails */}
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <div className="flex items-center gap-3">
                      <span>{formatDistance(ride.distance * 1000)}</span>
                      <span>{ride.duration} min</span>
                      <span>{getVehicleTypeLabel(ride.vehicleType)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      <span>{formatDistance(ride.distanceFromDriver * 1000)}</span>
                    </div>
                  </div>

                  {/* Notes si présentes */}
                  {ride.notes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-text-secondary">
                      💬 {ride.notes}
                    </div>
                  )}

                  {/* Course programmée */}
                  {ride.scheduledTime && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                      <Clock className="w-3 h-3" />
                      Programmée pour {ride.scheduledTime.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Carte et détails */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-text-dark">Demandes sur la carte</h3>
              <p className="text-text-secondary text-sm">
                Votre position et les demandes de course à proximité
              </p>
            </div>

            <InteractiveMap
              mode="driver"
              center={driverLocation?.coordinates ? {
                lat: driverLocation.coordinates[1],
                lng: driverLocation.coordinates[0]
              } : { lat: 33.5731, lng: -7.5898 }}
              zoom={13}
              height="400px"
              driverLocation={driverLocation}
              nearbyRides={nearbyRides}
              onLocationSelect={(type, location) => {
                if (type === 'driver') {
                  setDriverLocation(location);
                }
              }}
            />
          </Card>

          {/* Détails de la course sélectionnée */}
          {selectedRide && (
            <Card className="p-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-dark">Détails de la course</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRejectRide(selectedRide.id)}
                    icon={<XCircle className="w-4 h-4" />}
                  >
                    Refuser
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAcceptRide(selectedRide.id)}
                    disabled={isLoading}
                    icon={<CheckCircle className="w-4 h-4" />}
                  >
                    Accepter
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations passager */}
                <div>
                  <h4 className="font-medium text-text-dark mb-3">Informations passager</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedRide.passenger.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-text-dark">{selectedRide.passenger.name}</div>
                        <div className="flex items-center gap-1 text-sm text-text-secondary">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{selectedRide.passenger.rating} • Note passager</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-text-secondary" />
                      <span className="text-text-dark">{selectedRide.passenger.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-text-secondary" />
                      <span className="text-text-dark">{selectedRide.passengers} passager{selectedRide.passengers > 1 ? 's' : ''}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Car className="w-4 h-4 text-text-secondary" />
                      <span className="text-text-dark">{getVehicleTypeLabel(selectedRide.vehicleType)}</span>
                    </div>
                  </div>
                </div>

                {/* Détails du trajet */}
                <div>
                  <h4 className="font-medium text-text-dark mb-3">Détails du trajet</h4>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-primary mb-1">
                        {formatCurrency(selectedRide.estimatedPrice)}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {formatDistance(selectedRide.distance * 1000)} • {selectedRide.duration} min
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm text-text-dark">Départ</div>
                          <div className="text-sm text-text-secondary">{selectedRide.pickup.address}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm text-text-dark">Destination</div>
                          <div className="text-sm text-text-secondary">{selectedRide.destination.address}</div>
                        </div>
                      </div>
                    </div>

                    {selectedRide.notes && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm text-blue-900">Instructions</div>
                            <div className="text-sm text-blue-700">{selectedRide.notes}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedRide.scheduledTime && (
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <div>
                            <div className="font-medium text-sm text-orange-900">Course programmée</div>
                            <div className="text-sm text-orange-700">
                              {selectedRide.scheduledTime.toLocaleString('fr-FR')}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverRideRequestsPage;
