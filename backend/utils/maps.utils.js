import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY


if(!GOOGLE_MAPS_API_KEY){
    console.error("Google Maps API key is required but not provided")
}

export const getDistance = async (origin, destination) => {
    try {
      const originStr = Array.isArray(origin) ? `${origin[1]},${origin[0]}` : origin
      const destinationStr = Array.isArray(destination) ? `${destination[1]},${destination[0]}` : destination
  
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