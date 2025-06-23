
export const calculateRidePrice = (distance, duration, vehicleType) => {
    
    const basePrices = {
      standard: 2.5,
      comfort: 3.5,
      premium: 5.0,
      van: 4.5,
    }
  
    
    const pricePerKm = {
      standard: 1.2,
      comfort: 1.5,
      premium: 2.0,
      van: 1.8,
    }
  
    const pricePerMinute = {
      standard: 0.25,
      comfort: 0.3,
      premium: 0.4,
      van: 0.35,
    }
  
    const base = basePrices[vehicleType] || basePrices.standard
    const distancePrice = (pricePerKm[vehicleType] || pricePerKm.standard) * distance
    const timePrice = (pricePerMinute[vehicleType] || pricePerMinute.standard) * duration
  
    const total = base + distancePrice + timePrice
  
  
    const roundedTotal = Math.round(total * 100) / 100
  
    return {
      base,
      distance: distancePrice,
      time: timePrice,
      total: roundedTotal,
    }
  }
  
 
  export const calculateDeliveryPrice = (distance, packageSize, packageWeight) => {
    
    const basePrices = {
      small: 3.0,
      medium: 4.5,
      large: 6.0,
    }
  
    
    const pricePerKm = 1.0
  
    const weightPrices = {
      "0-1": 0,
      "1-5": 2.0,
      "5-10": 4.0,
      "10-20": 7.0,
      "20+": 12.0,
    }
  
    const base = basePrices[packageSize] || basePrices.medium
    const distancePrice = pricePerKm * distance
    const weightPrice = weightPrices[packageWeight] || weightPrices["1-5"]
  
   
    const total = base + distancePrice + weightPrice

    const roundedTotal = Math.round(total * 100) / 100
  
    return {
      base,
      distance: distancePrice,
      weight: weightPrice,
      total: roundedTotal,
    }
  }
  