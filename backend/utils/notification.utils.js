import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { sendNotificationEmail } from "./email.utils.js";


export const createNotification = async (notificationData) => {
  try {
    console.log('🔔 Début de la création d\'une nouvelle notification');
    console.log('📋 Données de la notification :', {
      destinataire: notificationData.recipient,
      titre: notificationData.title,
      type: notificationData.type,
      avecDonnées: !!notificationData.data
    });

   
    if (!notificationData.recipient) {
      console.error(' Erreur : recipient est requis');
      throw new Error('Le destinataire est requis');
    }

    if (!notificationData.title || !notificationData.message) {
      console.error(' Erreur : title et message sont requis');
      throw new Error('Le titre et le message sont requis');
    }

    const notification = new Notification(notificationData);

    console.log(' Sauvegarde de la notification en base de données...');
    await notification.save();

    console.log(' Notification enregistrée avec succès :', notification._id);

   
    if (notificationData.recipient) {
      try {
        console.log(' Recherche de l\'utilisateur pour l\'envoi de l\'email...');
        const user = await User.findById(notificationData.recipient).select('email firstName lastName');

        if (user && user.email) {
          console.log(`Envoi d'un email à : ${user.firstName} ${user.lastName} (${user.email})`);

          await sendNotificationEmail(
            user.email,
            notificationData.title,
            `<h3>${notificationData.title}</h3><p>${notificationData.message}</p>`
          );

          console.log(' Email envoyé avec succès');
        } else {
          console.log('ℹ️ Utilisateur introuvable ou sans email');
        }
      } catch (emailError) {
        console.error(' Erreur lors de l\'envoi de l\'email (la notification a quand même été créée) :', emailError.message);
      }
    }

    return notification;

  } catch (error) {
    console.error(" Erreur lors de la création de la notification :", error);


    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.error(' Erreurs de validation :', validationErrors);
      throw new Error(`Échec de la validation : ${validationErrors.join(', ')}`);
    }

    if (error.name === 'CastError') {
      console.error(' Erreur de conversion des données :', error.message);
      throw new Error('Format de données invalide');
    }

   null
    return null;
  }
};


export const createRideNotification = async (recipientId, rideData, notificationType) => {
  const notificationMessages = {
    ride_request: {
      title: "Nouvelle demande de course",
      message: `Course de ${rideData.pickup?.address} à ${rideData.destination?.address}`
    },
    ride_accepted: {
      title: "Course acceptée",
      message: "Le chauffeur a accepté votre course et se dirige vers vous"
    },
    ride_arrived: {
      title: "Chauffeur arrivé",
      message: "Le chauffeur est arrivé à votre point de départ"
    },
    ride_completed: {
      title: "Course terminée",
      message: "Votre course a été complétée avec succès"
    },
    ride_cancelled: {
      title: "Course annulée",
      message: "Votre course a été annulée"
    }
  };

  const notificationContent = notificationMessages[notificationType];
  if (!notificationContent) {
    throw new Error(`Type de notification inconnu : ${notificationType}`);
  }

  return await createNotification({
    recipient: recipientId,
    title: notificationContent.title,
    message: notificationContent.message,
    type: notificationType,
    reference: rideData._id || rideData.rideId,
    referenceModel: "Ride",
    data: {
      rideId: rideData._id || rideData.rideId,
      pickup: rideData.pickup,
      destination: rideData.destination,
      price: rideData.price,
      distance: rideData.distance,
      duration: rideData.duration
    }
  });
};
