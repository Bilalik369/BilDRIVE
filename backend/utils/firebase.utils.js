import admin from "firebase-admin"
import dotenv from "dotenv"


dotenv.config();

const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
  }
  

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
  }

  export const sendPushNotification = async (fcmToken, title, body, data = {}) => {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        data: {
          ...data,
          timestamp: new Date().toISOString(),
        },
        token: fcmToken,
        android: {
          notification: {
            icon: "ic_notification",
            color: "#2563eb",
            sound: "default",
            priority: "high",
          },
        },
        apns: {
          payload: {
            aps: {
              sound: "default",
              badge: 1,
            },
          },
        },
      }
  
      const response = await admin.messaging().send(message)
      console.log("Push notification sent successfully:", response)
      return { success: true, messageId: response }
    } catch (error) {
      console.error("Error sending push notification:", error)
      throw new Error(`Failed to send push notification: ${error.message}`)
    }
  }
  

