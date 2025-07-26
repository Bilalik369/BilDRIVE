import { sendNotificationEmail } from './utils/email.utils.js';


async function testEmailNotification() {
  try {
    console.log("Testing email notification system...");
    
    const result = await sendNotificationEmail(
      "bilal11iken@gmail.com", 
      "Test de notification Bildrive",
      `
        <h3>🚗 Nouvelle demande de course</h3>
        <p>Une nouvelle course a été demandée :</p>
        <ul>
          <li><strong>De :</strong>  charaf, beni mellal</li>
          <li><strong>Vers :</strong>  Avenue meghila, beni mellal</li>
          <li><strong>Prix :</strong> DH15.50</li>
          <li><strong>Distance :</strong> 8.2 km</li>
        </ul>
        <p>Connectez-vous à votre application pour accepter cette course.</p>
      `
    );
    
    if (result) {
      console.log(" E-mail de notification envoyé avec succès !");
    } else {
      console.log(" Échec de l'envoi de l'e-mail de notification");
    }
  } catch (error) {
    console.error(" Erreur lors du test :", error);
  }
}

testEmailNotification();
