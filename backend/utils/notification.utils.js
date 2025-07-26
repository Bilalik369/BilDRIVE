import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { sendNotificationEmail } from "./email.utils.js";

export const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();

    // Récupérer l'e-mail de l'utilisateur destinataire
    if (notificationData.recipient) {
      const user = await User.findById(notificationData.recipient);
      if (user && user.email) {
        // Envoyer une notification par e-mail
        await sendNotificationEmail(
          user.email,
          notificationData.title,
          `<h3>${notificationData.title}</h3><p>${notificationData.message}</p>`
        );
      }
    }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};
