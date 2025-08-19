import { Shield, DollarSign, Clock, Headphones, UserCheck, MapPin, Smartphone, CreditCard, Star } from "lucide-react"
import Card from "../ui/Card"

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "All drivers are background-checked and vehicles are regularly inspected for your safety.",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: DollarSign,
      title: "Affordable Pricing",
      description: "Transparent pricing with no hidden fees. Get the best value for your money.",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Clock,
      title: "Fast Booking",
      description: "Book a ride in seconds with our intuitive app. Your driver will be there in minutes.",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support to help you whenever you need assistance.",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: UserCheck,
      title: "Professional Drivers",
      description: "Experienced and verified drivers committed to providing excellent service.",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "Track your ride in real-time and share your trip details with loved ones.",
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
  ]

  const additionalFeatures = [
    {
      icon: Smartphone,
      title: "Easy-to-Use App",
      description: "Intuitive interface designed for seamless user experience",
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Options",
      description: "Pay with cash, card, or digital wallet - your choice",
    },
    {
      icon: Star,
      title: "Rating System",
      description: "Rate your experience and help maintain service quality",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mb-6">
            Why Choose <span className="text-primary">Bildrive</span>?
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            We're committed to providing the best ride-sharing experience with features designed around your safety,
            convenience, and satisfaction.
          </p>
        </div>

        {/* Main features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              hover
            >
              <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-text-dark mb-4">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Additional features */}
        <div className="bg-bg-main rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-text-dark mb-4">More Features You'll Love</h3>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Discover additional features that make Bildrive the preferred choice for millions of users worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-text-dark mb-2">{feature.title}</h4>
                <p className="text-text-secondary text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
