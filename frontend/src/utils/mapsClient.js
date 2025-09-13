import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://backend-bildrive-fmebbghucmhnemes.francecentral-01.azurewebsites.net/api';

// Create axios instance with base configuration
const mapsAPI = axios.create({
  baseURL: `${API_BASE_URL}/maps`,
  timeout: 10000,
});

// Add request interceptor to include auth token if available
mapsAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
mapsAPI.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    throw new Error(message);
  }
);

export const getDistance = async (origin, destination) => {
  try {
    const response = await mapsAPI.post('/distance', {
      origin,
      destination
    });
    return response;
  } catch (error) {
    console.error('Error getting distance:', error);
    throw error;
  }
};

export const getDirections = async (origin, destination, waypoints = []) => {
  try {
    const response = await mapsAPI.post('/directions', {
      origin,
      destination,
      waypoints
    });
    return response;
  } catch (error) {
    console.error('Error getting directions:', error);
    throw error;
  }
};

export const geocodeAddress = async (address) => {
  try {
    const response = await mapsAPI.post('/geocode', {
      address
    });
    return response;
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
};

export const reverseGeocode = async (coordinates) => {
  try {
    const response = await mapsAPI.post('/reverse-geocode', {
      coordinates
    });
    return response;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
};


export const calculateETA = async (origin, destination) => {
  try {
    const response = await mapsAPI.post('/eta', {
      origin,
      destination
    });
    return response;
  } catch (error) {
    console.error('Error calculating ETA:', error);
    throw error;
  }
};


// Calculate price based on distance and time
export const calculatePrice = (distance, duration, vehicleType = 'standard') => {
  const BASE_FARE = 5; // 5 MAD base fare
  const PRICE_PER_KM = 2; // 2 MAD per km
  const PRICE_PER_MINUTE = 0.5; // 0.5 MAD per minute

  const vehicleMultipliers = {
    economy: 1,
    standard: 1.2,
    premium: 1.5,
    suv: 1.8
  };

  const multiplier = vehicleMultipliers[vehicleType] || 1.2;
  const distanceKm = distance / 1000; // Convert meters to km
  const durationMinutes = duration / 60; // Convert seconds to minutes

  const subtotal = BASE_FARE + (distanceKm * PRICE_PER_KM) + (durationMinutes * PRICE_PER_MINUTE);
  const total = subtotal * multiplier;

  return {
    basefare: BASE_FARE,
    distancePrice: distanceKm * PRICE_PER_KM,
    timePrice: durationMinutes * PRICE_PER_MINUTE,
    vehicleMultiplier: multiplier,
    subtotal: subtotal,
    total: Math.round(total * 100) / 100, // Round to 2 decimal places
    formattedTotal: `${Math.round(total * 100) / 100} MAD`
  };
};


export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

export const formatDuration = (seconds) => {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
};



export default {
  getDistance,
  getDirections,
  geocodeAddress,
  reverseGeocode,
  calculateETA,
  calculatePrice,
  formatDistance,
  formatDuration
};
