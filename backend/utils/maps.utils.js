import axios from "axios"
import dotenv from "dotenv"

dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

console.log("GOOGLE_MAPS_API_KEY:", process.env.GOOGLE_MAPS_API_KEY);

if (!GOOGLE_MAPS_API_KEY) {
  console.error("Google Maps API key is required but not provided")
}


export const getDistance = async (origin, destination) => {
  try {
    console.log("=== getDirections Debug Info ===");
    console.log("Original origin:", origin);
    console.log("Original destination:", destination);


    const originStr = Array.isArray(origin) ? `${origin[1]},${origin[0]}` : origin
    const destinationStr = Array.isArray(destination) ? `${destination[1]},${destination[0]}` : destination
    console.log("Processed originStr:", originStr);
    console.log("Processed destinationStr:", destinationStr);
    console.log("API Key available:", !!GOOGLE_MAPS_API_KEY);
    console.log("API Key length:", GOOGLE_MAPS_API_KEY?.length);
    const response = await axios.get("https://maps.googleapis.com/maps/api/distancematrix/json", {
      params: {
        origins: originStr,
        destinations: destinationStr,
        units: "metric",
        mode: "driving",
        departure_time: "now",
        traffic_model: "best_guess",
        key: GOOGLE_MAPS_API_KEY,
      },
    })

    if (response.data.status !== "OK") {
      throw new Error(`Google Maps API error: ${response.data.status}`)
    }

    const element = response.data.rows[0].elements[0]

    if (element.status !== "OK") {
      throw new Error(`Route not found: ${element.status}`)
    }

    return {
      distance: element.distance.value, 
      distanceText: element.distance.text,
      duration: element.duration.value, 
      durationText: element.duration.text,
      durationInTraffic: element.duration_in_traffic ? element.duration_in_traffic.value : element.duration.value,
      durationInTrafficText: element.duration_in_traffic ? element.duration_in_traffic.text : element.duration.text,
    }
  } catch (error) {
    console.error("Error calculating distance:", error)
    throw new Error(`Failed to calculate distance: ${error.message}`)
  }
}


export const getDirections = async (origin, destination, waypoints = []) => {
  try {
    const originStr = Array.isArray(origin) ? `${origin[1]},${origin[0]}` : origin
    const destinationStr = Array.isArray(destination) ? `${destination[1]},${destination[0]}` : destination

    const params = {
      origin: originStr,
      destination: destinationStr,
      mode: "driving",
      departure_time: "now",
      traffic_model: "best_guess",
      key: GOOGLE_MAPS_API_KEY,
    }

    if (waypoints.length > 0) {
      params.waypoints = waypoints.map((wp) => (Array.isArray(wp) ? `${wp[1]},${wp[0]}` : wp)).join("|")
    }

    const response = await axios.get("https://maps.googleapis.com/maps/api/directions/json", {
      params,
    })

    if (response.data.status !== "OK") {
      throw new Error(`Google Directions API error: ${response.data.status}`)
    }

    const route = response.data.routes[0]
    const leg = route.legs[0]

    return {
      distance: leg.distance.value,
      distanceText: leg.distance.text,
      duration: leg.duration.value,
      durationText: leg.duration.text,
      durationInTraffic: leg.duration_in_traffic ? leg.duration_in_traffic.value : leg.duration.value,
      durationInTrafficText: leg.duration_in_traffic ? leg.duration_in_traffic.text : leg.duration.text,
      polyline: route.overview_polyline.points,
      steps: leg.steps.map((step) => ({
        distance: step.distance.value,
        duration: step.duration.value,
        instructions: step.html_instructions.replace(/<[^>]*>/g, ""), 
        startLocation: step.start_location,
        endLocation: step.end_location,
        polyline: step.polyline.points,
      })),
      bounds: route.bounds,
      copyrights: route.copyrights,
      warnings: route.warnings,
    }
  } catch (error) {
    console.error("Error getting directions:", error)
    throw new Error(`Failed to get directions: ${error.message}`)
  }
}


export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: address,
        key: GOOGLE_MAPS_API_KEY,
      },
    })

    if (response.data.status !== "OK") {
      throw new Error(`Geocoding API error: ${response.data.status}`)
    }

    const result = response.data.results[0]

    return {
      coordinates: [result.geometry.location.lng, result.geometry.location.lat], 
      formattedAddress: result.formatted_address,
      placeId: result.place_id,
      types: result.types,
      addressComponents: result.address_components,
      bounds: result.geometry.bounds,
      locationType: result.geometry.location_type,
    }
  } catch (error) {
    console.error("Error geocoding address:", error)
    throw new Error(`Failed to geocode address: ${error.message}`)
  }
}


export const reverseGeocode = async (coordinates) => {
  try {
    const [lng, lat] = coordinates
    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        latlng: `${lat},${lng}`,
        key: GOOGLE_MAPS_API_KEY,
      },
    })

    if (response.data.status !== "OK") {
      throw new Error(`Reverse geocoding API error: ${response.data.status}`)
    }

    const results = response.data.results

    return results.map((result) => ({
      formattedAddress: result.formatted_address,
      placeId: result.place_id,
      types: result.types,
      addressComponents: result.address_components,
    }))
  } catch (error) {
    console.error("Error reverse geocoding:", error)
    throw new Error(`Failed to reverse geocode: ${error.message}`)
  }
}










