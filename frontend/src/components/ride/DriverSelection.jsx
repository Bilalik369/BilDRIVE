import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  Car, 
  Phone, 
  MessageSquare,
  Navigation,
  DollarSign,
  Users,
  Filter,
  SortAsc,
  Zap
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatDistance } from '../../utils/helpers';
import { calculatePrice } from '../../utils/mapsClient';

const DriverSelection = ({
  pickupLocation,
  destinationLocation,
  routeInfo,
  vehicleType = 'standard',
  passengers = 1,
  onDriverSelect,
  onShowOnMap,
  maxDistance = 5, // 5km par défaut
  className = ""
}) => {
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('distance'); // distance, rating, price, eta
  const [filterBy, setFilterBy] = useState({
    minRating: 0,
    vehicleTypes: [],
    maxETA: 15 // minutes
  });

  // Simuler des chauffeurs disponibles
  const mockDrivers = [
    {
      id: 1,
      name: 'Ahmed Bennani',
      rating: 4.8,
      totalRides: 245,
      phone: '+212 6 12 34 56 78',
      avatar: null,
      vehicle: {
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        color: 'Blanche',
        plate: '123-A-45',
        type: 'standard'
      },
      location: {
        coordinates: [-7.5850, 33.5750], // À proximité
        address: 'Avenue Hassan II, Casablanca'
      },
      isOnline: true,
      acceptanceRate: 95,
      estimatedArrival: 3, // minutes
      priceMultiplier: 1.0,
      isVerified: true,
      badges: ['top_driver', 'punctual']
    },
    {
      id: 2,
      name: 'Fatima Zahra',
      rating: 4.9,
      totalRides: 189,
      phone: '+212 6 87 65 43 21',
      avatar: null,
      vehicle: {
        make: 'Hyundai',
        model: 'Accent',
        year: 2021,
        color: 'Grise',
        plate: '567-B-89',
        type: 'economy'
      },
      location: {
        coordinates: [-7.5900, 33.5680],
        address: 'Boulevard Zerktouni, Casablanca'
      },
      isOnline: true,
      acceptanceRate: 98,
      estimatedArrival: 5,
      priceMultiplier: 0.9,
      isVerified: true,
      badges: ['eco_friendly', 'female_driver']
    },
    {
      id: 3,
      name: 'Mohamed Taha',
      rating: 4.7,
      totalRides: 312,
      phone: '+212 6 55 44 33 22',
      avatar: null,
      vehicle: {
        make: 'Renault',
        model: 'Logan',
        year: 2019,
        color: 'Bleue',
        plate: '234-C-67',
        type: 'standard'
      },
      location: {
        coordinates: [-7.5800, 33.5800],
        address: 'Rue de la Liberté, Casablanca'
      },
      isOnline: true,
      acceptanceRate: 92,
      estimatedArrival: 7,
      priceMultiplier: 1.1,
      isVerified: true,
      badges: ['experienced']
    },
    {
      id: 4,
      name: 'Youssef Alami',
      rating: 4.6,
      totalRides: 156,
      phone: '+212 6 77 88 99 00',
      avatar: null,
      vehicle: {
        make: 'Dacia',
        model: 'Logan',
        year: 2022,
        color: 'Noire',
        plate: '890-D-12',
        type: 'premium'
      },
      location: {
        coordinates: [-7.5950, 33.5650],
        address: 'Quartier Bourgogne, Casablanca'
      },
      isOnline: true,
      acceptanceRate: 89,
      estimatedArrival: 8,
      priceMultiplier: 1.3,
      isVerified: false,
      badges: ['luxury']
    }
  ];

  useEffect(() => {
    if (pickupLocation?.coordinates) {
      loadAvailableDrivers();
    }
  }, [pickupLocation, vehicleType, maxDistance]);

  const loadAvailableDrivers = () => {
    setIsLoading(true);
    
    // Simuler un délai d'API
    setTimeout(() => {
      let filteredDrivers = mockDrivers.filter(driver => {
        // Filtrer par type de véhicule si spécifique
        if (vehicleType !== 'all' && driver.vehicle.type !== vehicleType) {
          return false;
        }

        // Filtrer par note minimum
        if (driver.rating < filterBy.minRating) {
          return false;
        }

        // Filtrer par ETA maximum
        if (driver.estimatedArrival > filterBy.maxETA) {
          return false;
        }

        // Calculer le prix pour ce chauffeur
        if (routeInfo?.distance && routeInfo?.duration) {
          const priceData = calculatePrice(
            routeInfo.distance,
            routeInfo.duration,
            vehicleType
          );
          driver.estimatedPrice = priceData.total * driver.priceMultiplier;
          driver.priceDetails = priceData;
        }

        return true;
      });

      // Trier les chauffeurs
      filteredDrivers.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'price':
            return (a.estimatedPrice || 0) - (b.estimatedPrice || 0);
          case 'eta':
            return a.estimatedArrival - b.estimatedArrival;
          case 'distance':
          default:
            return a.estimatedArrival - b.estimatedArrival; // Utiliser ETA comme proxy pour la distance
        }
      });

      setAvailableDrivers(filteredDrivers);
      setIsLoading(false);
    }, 1000);
  };

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
    onDriverSelect && onDriverSelect(driver);
  };

  const handleShowOnMap = (driver) => {
    onShowOnMap && onShowOnMap(driver);
  };

  const getBadgeInfo = (badge) => {
    const badges = {
      top_driver: { label: 'Top Driver', icon: '⭐', color: 'bg-yellow-100 text-yellow-800' },
      punctual: { label: 'Ponctuel', icon: '⏰', color: 'bg-blue-100 text-blue-800' },
      eco_friendly: { label: 'Eco', icon: '🌱', color: 'bg-green-100 text-green-800' },
      female_driver: { label: 'Conductrice', icon: '👩', color: 'bg-purple-100 text-purple-800' },
      experienced: { label: 'Expérimenté', icon: '🎯', color: 'bg-gray-100 text-gray-800' },
      luxury: { label: 'Luxe', icon: '💎', color: 'bg-indigo-100 text-indigo-800' }
    };
    return badges[badge] || { label: badge, icon: '🏷️', color: 'bg-gray-100 text-gray-800' };
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
    <div className={`space-y-4 ${className}`}>
      {/* Filtres et tri */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-secondary" />
            <span className="font-medium text-text-dark">Filtres:</span>
            <select
              value={filterBy.minRating}
              onChange={(e) => setFilterBy(prev => ({ ...prev, minRating: Number(e.target.value) }))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={0}>Toutes les notes</option>
              <option value={4.0}>4.0+ ⭐</option>
              <option value={4.5}>4.5+ ⭐</option>
              <option value={4.8}>4.8+ ⭐</option>
            </select>
            <select
              value={filterBy.maxETA}
              onChange={(e) => setFilterBy(prev => ({ ...prev, maxETA: Number(e.target.value) }))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={30}>Sous 30 min</option>
              <option value={15}>Sous 15 min</option>
              <option value={10}>Sous 10 min</option>
              <option value={5}>Sous 5 min</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-text-secondary" />
            <span className="font-medium text-text-dark">Trier par:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="distance">Distance</option>
              <option value="rating">Note</option>
              <option value="price">Prix</option>
              <option value="eta">Temps d'arrivée</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Liste des chauffeurs */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : availableDrivers.length === 0 ? (
          <Card className="p-6 text-center">
            <Car className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-semibold text-text-dark mb-2">Aucun chauffeur disponible</h3>
            <p className="text-text-secondary text-sm">
              Aucun chauffeur disponible dans votre zone. Essayez d'ajuster vos filtres.
            </p>
          </Card>
        ) : (
          availableDrivers.map((driver) => (
            <Card 
              key={driver.id}
              className={`p-4 transition-all hover:shadow-lg cursor-pointer ${
                selectedDriver?.id === driver.id ? 'ring-2 ring-primary bg-primary bg-opacity-5' : ''
              }`}
              onClick={() => handleDriverSelect(driver)}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {driver.name.split(' ').map(n => n.charAt(0)).join('')}
                  </div>
                  {driver.isVerified && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  {driver.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>

                {/* Informations chauffeur */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-text-dark">{driver.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{driver.rating}</span>
                          <span>({driver.totalRides} courses)</span>
                        </div>
                        <span>•</span>
                        <span>{driver.acceptanceRate}% acceptation</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {driver.estimatedPrice && (
                        <div className="text-lg font-bold text-primary">
                          {formatCurrency(driver.estimatedPrice)}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm text-text-secondary">
                        <Clock className="w-3 h-3" />
                        <span>{driver.estimatedArrival} min</span>
                      </div>
                    </div>
                  </div>

                  {/* Véhicule */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="w-4 h-4 text-text-secondary" />
                      <span className="text-text-dark">
                        {driver.vehicle.make} {driver.vehicle.model} ({driver.vehicle.year})
                      </span>
                      <span className="text-text-secondary">• {driver.vehicle.color}</span>
                      <span className="text-text-secondary">• {getVehicleTypeLabel(driver.vehicle.type)}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  {driver.badges?.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      {driver.badges.map((badge, index) => {
                        const badgeInfo = getBadgeInfo(badge);
                        return (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${badgeInfo.color}`}
                          >
                            {badgeInfo.icon} {badgeInfo.label}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowOnMap(driver);
                        }}
                        className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark"
                      >
                        <MapPin className="w-4 h-4" />
                        Voir sur la carte
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Logique pour contacter le chauffeur
                        }}
                        className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-dark"
                      >
                        <Phone className="w-4 h-4" />
                        Contacter
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-secondary">
                        📍 {formatDistance(driver.estimatedArrival * 200)} • Plaque: {driver.vehicle.plate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedDriver?.id === driver.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-medium text-text-dark">Temps d'arrivée</div>
                      <div className="text-primary font-semibold">{driver.estimatedArrival} min</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-medium text-text-dark">Note moyenne</div>
                      <div className="text-primary font-semibold">{driver.rating} ⭐</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-medium text-text-dark">Taux d'acceptation</div>
                      <div className="text-primary font-semibold">{driver.acceptanceRate}%</div>
                    </div>
                  </div>

                  {driver.priceDetails && (
                    <div className="mt-3 p-3 bg-blue-50 rounded">
                      <div className="text-sm font-medium text-blue-900 mb-2">Détail du prix</div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                        <div>Tarif de base: {formatCurrency(driver.priceDetails.basefare)}</div>
                        <div>Distance: {formatCurrency(driver.priceDetails.distancePrice)}</div>
                        <div>Temps: {formatCurrency(driver.priceDetails.timePrice)}</div>
                        <div>Multiplicateur: x{driver.priceMultiplier}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Actions pour le chauffeur sélectionné */}
      {selectedDriver && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-text-dark">{selectedDriver.name}</div>
              <div className="text-sm text-text-secondary">
                Arrivée dans {selectedDriver.estimatedArrival} min • {formatCurrency(selectedDriver.estimatedPrice)}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                icon={<MessageSquare className="w-4 h-4" />}
              >
                Message
              </Button>
              <Button
                size="sm"
                icon={<Zap className="w-4 h-4" />}
              >
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverSelection;
