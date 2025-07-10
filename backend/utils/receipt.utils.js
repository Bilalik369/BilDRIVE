
export const generateRideReceipt = async (ride) => {
    try {
      
      return `https://bildrive.com/receipts/ride_${ride._id}.pdf`
    } catch (error) {
      console.error("Error generating ride receipt:", error)
      return null
    }
  }

  export const generateDeliveryReceipt = async (delivery) => {
    try {
     
      return `https://bildrive.com/receipts/delivery_${delivery._id}.pdf`
    } catch (error) {
      console.error("Error generating delivery receipt:", error)
      return null
    }
  }
  