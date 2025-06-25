import Notification from "../models/notification.model.js"
import { sendPushNotification } from "./firebase.utils.js"

export const createNotification = async (notificationData) => {
  try {

    const notification = new Notification(notificationData)
    await notification.save()


    if (notificationData.fcmToken) {
      await sendPushNotification(
        notificationData.fcmToken,
        notificationData.title,
        notificationData.message,
        notificationData.data,
      )
    }

    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    return null
  }
}