import { sendRideRequestEmailToDriver } from './utils/email.utils.js';


async function testRideRequestEmail() {
  try {
    console.log("Testing ride request email for driver...");
    
    const result = await sendRideRequestEmailToDriver(
      "jawadbouzir01@gmail.com", 
      "123 Avenue Mohammed V, Casablanca",
      "456 Boulevard Hassan II, Rabat", 
      "250",
      "85.5"
    );
    
    if (result) {
      console.log(" E-mail de demande de course envoyé avec succès !");
      console.log(" Contenu de l'e-mail :");
      console.log("Sujet : 🚗 Nouvelle demande de course");
      console.log("De : 123 Avenue Mohammed V, Casablanca");
      console.log("Vers : 456 Boulevard Hassan II, Rabat");
      console.log("Prix estimé : 250 DH");
      console.log("Distance : 85.5 km");
    } else {
      console.log(" Échec de l'envoi de l'e-mail de demande de course");
    }
  } catch (error) {
    console.error(" Erreur lors du test :", error);
  }
}

testRideRequestEmail();
