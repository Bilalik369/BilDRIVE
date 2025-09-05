import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { reverseGeocode, getDirections } from '../../utils/mapsClient';
import { toast } from 'react-hot-toast';

const InteractiveMap = ({
  mode = 'passenger',
  onLocationSelect,
  onRouteCalculated,
  onDriverLocationUpdate,
  onRideSelect,
  center = { lat: 33.5731, lng: -7.5898 }, // Casablanca
  zoom = 12,
  height = '400px',
  pickupLocation = null,
  destinationLocation = null,
  driverLocation = null,
  nearbyRides = [],
  availableDrivers = [],
  showDriverRadius = false,
  radiusKm = 5
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const polylineRef = useRef(null);
  const radiusCircleRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        await loader.load();

        if (mapRef.current && !mapInstanceRef.current) {
          const map = new window.google.maps.Map(mapRef.current, {
            center,
            zoom,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          mapInstanceRef.current = map;
          setIsMapLoaded(true);

          // Add click listener for passenger mode
          if (mode === 'passenger') {
            map.addListener('click', handleMapClick);
          }
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        toast.error('Failed to load map');
      }
    };

    initializeMap();
  }, []);

  // Handle map clicks for passenger mode
  const handleMapClick = useCallback(async (event) => {
    if (mode !== 'passenger') return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const coordinates = [lng, lat];

    try {
      const addresses = await reverseGeocode(coordinates);
      const location = {
        coordinates,
        address: addresses[0]?.formattedAddress || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        placeId: addresses[0]?.placeId,
        type: clickCount === 0 ? 'pickup' : 'destination'
      };

      if (clickCount === 0) {
        setClickCount(1);
        onLocationSelect && onLocationSelect('pickup', location);
      } else if (clickCount === 1) {
        setClickCount(2);
        onLocationSelect && onLocationSelect('destination', location);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      toast.error('Failed to get address for this location');
    }
  }, [mode, clickCount, onLocationSelect]);

  // Create or update markers
  const updateMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !isMapLoaded) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    markersRef.current = {};

    // Pickup marker (green)
    if (pickupLocation?.coordinates) {
      const [lng, lat] = pickupLocation.coordinates;
      markersRef.current.pickup = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        title: pickupLocation.address || 'Pickup Location',
        label: { text: 'A', color: 'white', fontWeight: 'bold' },
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="15" fill="#4CAF50" stroke="white" stroke-width="3"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        }
      });
    }

    // Destination marker (red)
    if (destinationLocation?.coordinates) {
      const [lng, lat] = destinationLocation.coordinates;
      markersRef.current.destination = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        title: destinationLocation.address || 'Destination',
        label: { text: 'B', color: 'white', fontWeight: 'bold' },
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="15" fill="#F44336" stroke="white" stroke-width="3"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        }
      });
    }

    // Driver marker (blue)
    if (driverLocation?.coordinates) {
      const [lng, lat] = driverLocation.coordinates;
      markersRef.current.driver = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        title: 'Driver Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="15" fill="#2196F3" stroke="white" stroke-width="3"/>
              <text x="20" y="25" text-anchor="middle" fill="white" font-size="12" font-weight="bold">🚗</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        }
      });

      // Add click listener for driver location updates
      if (mode === 'driver') {
        markersRef.current.driver.addListener('dragend', (event) => {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          const newLocation = {
            coordinates: [lng, lat],
            timestamp: Date.now()
          };
          onDriverLocationUpdate && onDriverLocationUpdate(newLocation);
        });
        markersRef.current.driver.setDraggable(true);
      }
    }

    // Available drivers markers (for passenger mode)
    if (mode === 'passenger' && availableDrivers?.length > 0) {
      availableDrivers.forEach((driver, index) => {
        if (driver.location?.coordinates) {
          const [lng, lat] = driver.location.coordinates;
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapInstanceRef.current,
            title: `${driver.name} - ${driver.vehicle || 'Véhicule'} - ${driver.rating}⭐`,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="35" height="35" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="17.5" cy="17.5" r="15" fill="#4CAF50" stroke="white" stroke-width="3"/>
                  <text x="17.5" y="22" text-anchor="middle" fill="white" font-size="14" font-weight="bold">🚗</text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(35, 35),
              anchor: new window.google.maps.Point(17.5, 17.5)
            }
          });

          // Add click listener for driver selection
          marker.addListener('click', () => {
            onRideSelect && onRideSelect('driver', driver);
          });

          markersRef.current[`driver_${index}`] = marker;
        }
      });
    }

    // Nearby rides markers (for driver mode)
    if (mode === 'driver' && nearbyRides?.length > 0) {
      nearbyRides.forEach((ride, index) => {
        if (ride.pickup?.coordinates) {
          const [lng, lat] = ride.pickup.coordinates;
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapInstanceRef.current,
            title: `Course de ${ride.passenger?.name || 'Passager'} vers ${ride.destination?.address || 'Destination inconnue'}`,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="35" height="35" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="17.5" cy="17.5" r="15" fill="#FF9800" stroke="white" stroke-width="3"/>
                  <text x="17.5" y="22" text-anchor="middle" fill="white" font-size="10" font-weight="bold">👤</text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(35, 35),
              anchor: new window.google.maps.Point(17.5, 17.5)
            }
          });

          // Add click listener for ride selection
          marker.addListener('click', () => {
            onRideSelect && onRideSelect('ride', ride);
          });

          markersRef.current[`ride_${index}`] = marker;
        }
      });
    }
  }, [isMapLoaded, pickupLocation, destinationLocation, driverLocation, nearbyRides, availableDrivers, mode, onDriverLocationUpdate, onRideSelect]);

  // Update route when pickup and destination are available
  const updateRoute = useCallback(async () => {
    if (!mapInstanceRef.current || !isMapLoaded || !pickupLocation?.coordinates || !destinationLocation?.coordinates) {
      return;
    }

    try {
      // Clear existing polyline
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }

      const routeData = await getDirections(pickupLocation.coordinates, destinationLocation.coordinates);
      
      // Draw polyline
      const decodedPath = window.google.maps.geometry.encoding.decodePath(routeData.polyline);
      polylineRef.current = new window.google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: mode === 'driver' ? '#4CAF50' : '#2196F3',
        strokeOpacity: 1.0,
        strokeWeight: 5
      });

      polylineRef.current.setMap(mapInstanceRef.current);

      // Fit bounds to show entire route
      const bounds = new window.google.maps.LatLngBounds();
      decodedPath.forEach(point => bounds.extend(point));
      if (driverLocation?.coordinates) {
        const [lng, lat] = driverLocation.coordinates;
        bounds.extend(new window.google.maps.LatLng(lat, lng));
      }
      mapInstanceRef.current.fitBounds(bounds);

      // Send route data to parent
      const formattedRouteData = {
        distance: routeData.distance,
        distanceText: routeData.distanceText,
        duration: routeData.duration,
        durationText: routeData.durationText,
        polyline: routeData.polyline,
        pickup: pickupLocation,
        destination: destinationLocation
      };

      onRouteCalculated && onRouteCalculated(formattedRouteData);

    } catch (error) {
      console.error('Error calculating route:', error);
      toast.error('Failed to calculate route');
    }
  }, [isMapLoaded, pickupLocation, destinationLocation, driverLocation, mode, onRouteCalculated]);

  // Update markers when locations change
  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  // Update route when pickup and destination change
  useEffect(() => {
    updateRoute();
  }, [updateRoute]);

  // Update radius circle when driver location or radius changes
  const updateRadiusCircle = useCallback(() => {
    if (!mapInstanceRef.current || !isMapLoaded) return;

    // Clear existing radius circle
    if (radiusCircleRef.current) {
      radiusCircleRef.current.setMap(null);
      radiusCircleRef.current = null;
    }

    // Show radius circle for driver mode when showDriverRadius is true
    if (mode === 'driver' && showDriverRadius && driverLocation?.coordinates) {
      const [lng, lat] = driverLocation.coordinates;

      radiusCircleRef.current = new window.google.maps.Circle({
        strokeColor: '#4CAF50',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#4CAF50',
        fillOpacity: 0.1,
        map: mapInstanceRef.current,
        center: { lat, lng },
        radius: radiusKm * 1000, // Convert km to meters
        clickable: false
      });
    }
  }, [isMapLoaded, mode, showDriverRadius, driverLocation, radiusKm]);

  // Update radius circle when relevant props change
  useEffect(() => {
    updateRadiusCircle();
  }, [updateRadiusCircle]);

  // Reset click count when switching modes or clearing locations
  useEffect(() => {
    if (!pickupLocation && !destinationLocation) {
      setClickCount(0);
    }
  }, [pickupLocation, destinationLocation]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }}
        className="rounded-lg overflow-hidden shadow-md"
      />
      
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-gray-600">Loading map...</span>
          </div>
        </div>
      )}

      {mode === 'passenger' && isMapLoaded && (
        <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md text-sm">
          {clickCount === 0 && "Cliquez sur la carte pour définir le départ"}
          {clickCount === 1 && "Cliquez sur la carte pour définir la destination"}
          {clickCount >= 2 && "Itinéraire calculé"}
        </div>
      )}

      {mode === 'driver' && isMapLoaded && showDriverRadius && (
        <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full opacity-60"></div>
            <span>Zone de recherche ({radiusKm}km)</span>
          </div>
        </div>
      )}

      {mode === 'passenger' && availableDrivers?.length > 0 && (
        <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg shadow-md text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{availableDrivers.length} chauffeur{availableDrivers.length > 1 ? 's' : ''} disponible{availableDrivers.length > 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
