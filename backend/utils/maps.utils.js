// import axios from "axios"
// import dotenv from "dotenv"

// dotenv.config();

// const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

// console.log("GOOGLE_MAPS_API_KEY:", process.env.GOOGLE_MAPS_API_KEY);

// if (!GOOGLE_MAPS_API_KEY) {
//   console.error("Google Maps API key is required but not provided")
// }


// export const getDistance = async (origin, destination) => {
//   try {
//     const originStr = Array.isArray(origin) ? `${origin[1]},${origin[0]}` : origin
//     const destinationStr = Array.isArray(destination) ? `${destination[1]},${destination[0]}` : destination

//     const response = await axios.get("https://maps.googleapis.com/maps/api/distancematrix/json", {
//       params: {
//         origins: originStr,
//         destinations: destinationStr,
//         units: "metric",
//         mode: "driving",
//         departure_time: "now",
//         traffic_model: "best_guess",
//         key: GOOGLE_MAPS_API_KEY,
//       },
//     })

//     if (response.data.status !== "OK") {
//       throw new Error(`Google Maps API error: ${response.data.status}`)
//     }

//     const element = response.data.rows[0].elements[0]

//     if (element.status !== "OK") {
//       throw new Error(`Route not found: ${element.status}`)
//     }

//     return {
//       distance: element.distance.value, 
//       distanceText: element.distance.text,
//       duration: element.duration.value, 
//       durationText: element.duration.text,
//       durationInTraffic: element.duration_in_traffic ? element.duration_in_traffic.value : element.duration.value,
//       durationInTrafficText: element.duration_in_traffic ? element.duration_in_traffic.text : element.duration.text,
//     }
//   } catch (error) {
//     console.error("Error calculating distance:", error)
//     throw new Error(`Failed to calculate distance: ${error.message}`)
//   }
// }


// export const getDirections = async (origin, destination, waypoints = []) => {
//   try {
//     const originStr = Array.isArray(origin) ? `${origin[1]},${origin[0]}` : origin
//     const destinationStr = Array.isArray(destination) ? `${destination[1]},${destination[0]}` : destination

//     const params = {
//       origin: originStr,
//       destination: destinationStr,
//       mode: "driving",
//       departure_time: "now",
//       traffic_model: "best_guess",
//       key: GOOGLE_MAPS_API_KEY,
//     }

//     if (waypoints.length > 0) {
//       params.waypoints = waypoints.map((wp) => (Array.isArray(wp) ? `${wp[1]},${wp[0]}` : wp)).join("|")
//     }

//     const response = await axios.get("https://maps.googleapis.com/maps/api/directions/json", {
//       params,
//     })

//     if (response.data.status !== "OK") {
//       throw new Error(`Google Directions API error: ${response.data.status}`)
//     }

//     const route = response.data.routes[0]
//     const leg = route.legs[0]

//     return {
//       distance: leg.distance.value,
//       distanceText: leg.distance.text,
//       duration: leg.duration.value,
//       durationText: leg.duration.text,
//       durationInTraffic: leg.duration_in_traffic ? leg.duration_in_traffic.value : leg.duration.value,
//       durationInTrafficText: leg.duration_in_traffic ? leg.duration_in_traffic.text : leg.duration.text,
//       polyline: route.overview_polyline.points,
//       steps: leg.steps.map((step) => ({
//         distance: step.distance.value,
//         duration: step.duration.value,
//         instructions: step.html_instructions.replace(/<[^>]*>/g, ""), 
//         startLocation: step.start_location,
//         endLocation: step.end_location,
//         polyline: step.polyline.points,
//       })),
//       bounds: route.bounds,
//       copyrights: route.copyrights,
//       warnings: route.warnings,
//     }
//   } catch (error) {
//     console.error("Error getting directions:", error)
//     throw new Error(`Failed to get directions: ${error.message}`)
//   }
// }


// export const geocodeAddress = async (address) => {
//   try {
//     const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
//       params: {
//         address: address,
//         key: GOOGLE_MAPS_API_KEY,
//       },
//     })

//     if (response.data.status !== "OK") {
//       throw new Error(`Geocoding API error: ${response.data.status}`)
//     }

//     const result = response.data.results[0]

//     return {
//       coordinates: [result.geometry.location.lng, result.geometry.location.lat], 
//       formattedAddress: result.formatted_address,
//       placeId: result.place_id,
//       types: result.types,
//       addressComponents: result.address_components,
//       bounds: result.geometry.bounds,
//       locationType: result.geometry.location_type,
//     }
//   } catch (error) {
//     console.error("Error geocoding address:", error)
//     throw new Error(`Failed to geocode address: ${error.message}`)
//   }
// }


// export const reverseGeocode = async (coordinates) => {
//   try {
//     const [lng, lat] = coordinates
//     const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
//       params: {
//         latlng: `${lat},${lng}`,
//         key: GOOGLE_MAPS_API_KEY,
//       },
//     })

//     if (response.data.status !== "OK") {
//       throw new Error(`Reverse geocoding API error: ${response.data.status}`)
//     }

//     const results = response.data.results

//     return results.map((result) => ({
//       formattedAddress: result.formatted_address,
//       placeId: result.place_id,
//       types: result.types,
//       addressComponents: result.address_components,
//     }))
//   } catch (error) {
//     console.error("Error reverse geocoding:", error)
//     throw new Error(`Failed to reverse geocode: ${error.message}`)
//   }
// }

// export const findNearbyPlaces = async (coordinates, radius = 1000, type = null) => {
//   try {
//     const [lng, lat] = coordinates
//     const params = {
//       location: `${lat},${lng}`,
//       radius: radius,
//       key: GOOGLE_MAPS_API_KEY,
//     }

//     if (type) {
//       params.type = type
//     }

//     const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
//       params,
//     })

//     if (response.data.status !== "OK") {
//       throw new Error(`Places API error: ${response.data.status}`)
//     }

//     return response.data.results.map((place) => ({
//       placeId: place.place_id,
//       name: place.name,
//       vicinity: place.vicinity,
//       types: place.types,
//       rating: place.rating,
//       priceLevel: place.price_level,
//       coordinates: [place.geometry.location.lng, place.geometry.location.lat],
//       photos: place.photos ? place.photos.map((photo) => photo.photo_reference) : [],
//       openingHours: place.opening_hours,
//     }))
//   } catch (error) {
//     console.error("Error finding nearby places:", error)
//     throw new Error(`Failed to find nearby places: ${error.message}`)
//   }
// }


// export const getPlaceDetails = async (placeId) => {
//   try {
//     const response = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
//       params: {
//         place_id: placeId,
//         fields: "name,formatted_address,geometry,formatted_phone_number,website,rating,reviews,opening_hours,photos",
//         key: GOOGLE_MAPS_API_KEY,
//       },
//     })

//     if (response.data.status !== "OK") {
//       throw new Error(`Place Details API error: ${response.data.status}`)
//     }

//     const place = response.data.result

//     return {
//       placeId: placeId,
//       name: place.name,
//       formattedAddress: place.formatted_address,
//       coordinates: [place.geometry.location.lng, place.geometry.location.lat],
//       phoneNumber: place.formatted_phone_number,
//       website: place.website,
//       rating: place.rating,
//       reviews: place.reviews,
//       openingHours: place.opening_hours,
//       photos: place.photos ? place.photos.map((photo) => photo.photo_reference) : [],
//     }
//   } catch (error) {
//     console.error("Error getting place details:", error)
//     throw new Error(`Failed to get place details: ${error.message}`)
//   }
// }


// export const calculateETA = async (origin, destination) => {
//   try {
//     const result = await getDistance(origin, destination)
//     const etaMinutes = Math.ceil(result.durationInTraffic / 60)

//     return {
//       eta: etaMinutes,
//       etaText: `${etaMinutes} min`,
//       distance: result.distance,
//       distanceText: result.distanceText,
//       withTraffic: true,
//     }
//   } catch (error) {
//     console.error("Error calculating ETA:", error)
//     throw new Error(`Failed to calculate ETA: ${error.message}`)
//   }
// }


// export const validateCoordinates = (coordinates) => {
//   if (!Array.isArray(coordinates) || coordinates.length !== 2) {
//     return false
//   }

//   const [lng, lat] = coordinates
//   return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90
// }


// export const calculateHaversineDistance = (coord1, coord2) => {
//   const [lng1, lat1] = coord1
//   const [lng2, lat2] = coord2

//   const R = 6371000 
//   const φ1 = (lat1 * Math.PI) / 180
//   const φ2 = (lat2 * Math.PI) / 180
//   const Δφ = ((lat2 - lat1) * Math.PI) / 180
//   const Δλ = ((lng2 - lng1) * Math.PI) / 180

//   const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

//   return R * c 
// }
// mockMaps.utils.js

export const getDistance = async (origin, destination) => {
  console.log("Mock getDistance called");
  return {
    distance: 5000,            // 5 km
    distanceText: "5 km",
    duration: 600,             // 10 minutes in seconds
    durationText: "10 mins",
    durationInTraffic: 720,    // 12 minutes in seconds
    durationInTrafficText: "12 mins",
  };
};

export const getDirections = async (origin, destination, waypoints = []) => {
  console.log("Mock getDirections called");
  return {
    distance: 5000,
    distanceText: "5 km",
    duration: 600,
    durationText: "10 mins",
    durationInTraffic: 720,
    durationInTrafficText: "12 mins",
    polyline: "mockPolylineString",
    steps: [
      {
        distance: 2000,
        duration: 240,
        instructions: "Head north",
        startLocation: { lat: 40.0, lng: -74.0 },
        endLocation: { lat: 40.01, lng: -74.01 },
        polyline: "stepPolyline1",
      },
      {
        distance: 3000,
        duration: 360,
        instructions: "Turn right",
        startLocation: { lat: 40.01, lng: -74.01 },
        endLocation: { lat: 40.02, lng: -74.02 },
        polyline: "stepPolyline2",
      },
    ],
    bounds: {},
    copyrights: "",
    warnings: [],
  };
};

export const geocodeAddress = async (address) => {
  console.log("Mock geocodeAddress called");
  return {
    coordinates: [-74.00597, 40.71278], // New York City approx
    formattedAddress: "Mocked Address, NYC",
    placeId: "mockPlaceId123",
    types: ["street_address"],
    addressComponents: [],
    bounds: null,
    locationType: "ROOFTOP",
  };
};

export const reverseGeocode = async (coordinates) => {
  console.log("Mock reverseGeocode called");
  return [
    {
      formattedAddress: "Mocked Reverse Address",
      placeId: "mockPlaceId456",
      types: ["locality", "political"],
      addressComponents: [],
    },
  ];
};

export const findNearbyPlaces = async (coordinates, radius = 1000, type = null) => {
  console.log("Mock findNearbyPlaces called");
  return [
    {
      placeId: "mockPlace1",
      name: "Mock Coffee Shop",
      vicinity: "123 Mock St",
      types: ["cafe", "food", "establishment"],
      rating: 4.5,
      priceLevel: 2,
      coordinates: [-74.00597, 40.71278],
      photos: [],
      openingHours: {},
    },
  ];
};

export const getPlaceDetails = async (placeId) => {
  console.log("Mock getPlaceDetails called");
  return {
    placeId,
    name: "Mock Place",
    formattedAddress: "123 Mock Place St",
    coordinates: [-74.00597, 40.71278],
    phoneNumber: "123-456-7890",
    website: "https://mockplace.example.com",
    rating: 4.5,
    reviews: [],
    openingHours: {},
    photos: [],
  };
};

export const calculateETA = async (origin, destination) => {
  console.log("Mock calculateETA called");
  return {
    eta: 12,
    etaText: "12 mins",
    distance: 5000,
    distanceText: "5 km",
    withTraffic: true,
  };
};

export const validateCoordinates = (coordinates) => {
  console.log("Mock validateCoordinates called");
  return Array.isArray(coordinates) && coordinates.length === 2;
};

export const calculateHaversineDistance = (coord1, coord2) => {
  console.log("Mock calculateHaversineDistance called");
  return 5000; // fixed 5km
};
