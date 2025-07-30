import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { 
  sendNotificationEmail, 
  sendRideRequestEmailToDriver, 
  sendRideAcceptedEmailToPassenger 
} from "./email.utils.js";

export const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();

    if (notificationData.recipient) {
      const user = await User.findById(notificationData.recipient);
      if (user && user.email) {
        
        if (notificationData.type === "ride_request" && notificationData.data) {
          const { pickup, destination, price, distance } = notificationData.data;
          
          const distanceInKm = distance ? (distance / 1000).toFixed(1) : "0";
          const formattedPrice = price ? parseFloat(price).toFixed(2) : "0";

          await sendRideRequestEmailToDriver(
            user.email,
            pickup?.address || "Adresse de départ",
            destination?.address || "Adresse d'arrivée",
            formattedPrice,
            distanceInKm
          );
          
        } else if (notificationData.type === "ride_accepted" && notificationData.data?.emailData) {
      
          const { chauffeur, arriveeEstimee, distance, prix } = notificationData.data.emailData;
          
          await sendRideAcceptedEmailToPassenger(
            user.email,
            chauffeur,
            arriveeEstimee,
            distance,
            prix
          );
          
        } else {
       
          await sendNotificationEmail(
            user.email,
            notificationData.title,
            `<h3>${notificationData.title}</h3><p>${notificationData.message}</p>`
          );
        }
      }
    }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};