import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import Card from "../ui/Card"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Lottie from "lottie-react"
import contactAnimation from "../../assete/6gjWMu4rTY.json"

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    message: ""
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Ici vous pouvez ajouter la logique d'envoi du formulaire
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({ nom: "", email: "", message: "" })
  }

  return (
    <section className="relative bg-gradient-to-br from-bg-main via-white to-card-bg py-20">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-text-secondary opacity-10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mb-4">Contactez-nous</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Nous aimerions avoir de vos nouvelles. Contactez-nous pour toute question ou support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Lottie Animation - Left Side */}
          <div className="order-2 lg:order-1">
            <Lottie 
              animationData={contactAnimation}
              loop={true}
              autoplay={true}
              style={{ height: '500px', width: '100%' }}
            />
          </div>

          {/* Contact Form - Right Side */}
          <div className="order-1 lg:order-2">
            <Card className="p-6 shadow-xl">
              <h3 className="text-xl font-bold text-text-dark mb-4">Envoyez-nous un message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nom */}
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-text-dark mb-1">
                    Nom complet
                  </label>
                  <Input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    placeholder="Votre nom complet"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-1">
                    Adresse email
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="votre@email.com"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-dark mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-full text-text-dark placeholder-placeholder-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    style={{
                      borderRadius: '20px',
                      outline: '0 !important',
                      boxSizing: 'border-box',
                    }}
                    placeholder="Votre message..."
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  size="md" 
                  className="w-full"
                  icon={<Send className="w-4 h-4" />}
                >
                  Envoyer le message
                </Button>
              </form>

              {/* Contact Info */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div>
                    <Mail className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-xs text-text-secondary">support@bildrive.com</p>
                  </div>
                  <div>
                    <Phone className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-xs text-text-secondary">+212 6052-28749</p>
                  </div>
                  <div>
                    <MapPin className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-xs text-text-secondary">Beni mellal, Maroc</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact


