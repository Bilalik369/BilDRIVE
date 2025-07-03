import { sendPushNotification } from './utils/firebase.utils.js';

const testToken = "your_valid_fcm_token_here";

sendPushNotification(testToken, "Hello", "This is a test notification")
  .then(response => console.log("Test notification sent:", response))
  .catch(err => console.error("Error:", err));
