import { Check, Car, Crown, Zap } from "lucide-react"
import Button from "../ui/Button"
import Card from "../ui/Card"

const Pricing = () => {
  const vehicleTypes = [
    {
      name: "Economy",
      icon: Car,
      description: "Affordable rides for everyday travel",
      basePrice: 2.5,
      perKm: 1.2,
      perMinute: 0.25,
      features: [
        "Compact and fuel-efficient cars",
        "Professional drivers",
        "Real-time tracking",
        "24/7 support",
        "Safe and reliable",
      ],
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      popular: false,
    },
    {
      name: "Standard",
      icon: Car,
      description: "Comfortable rides with more space",
      basePrice: 3.0,
      perKm: 1.5,
      perMinute: 0.3,
      features: [
        "Mid-size comfortable vehicles",
        "Experienced drivers",
        "Real-time tracking",
        "24/7 priority support",
        "Climate control",
        "Phone charging ports",
      ],
      color: "text-primary",
      bgColor: "bg-purple-50",
      borderColor: "border-primary",
      popular: true,
    },
    {
      name: "Premium",
      icon: Crown,
      description: "Luxury experience for special occasions",
      basePrice: 4.5,
      perKm: 2.0,
      perMinute: 0.4,
      features: [
        "Luxury vehicles (BMW, Mercedes, etc.)",
        "Top-rated professional drivers",
        "Real-time tracking",
        "VIP support",
        "Premium amenities",
        "Complimentary water",
        "Wi-Fi available",
      ],
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      popular: false,
    },
  ]

  const additionalServices = [
    {
      name: "Airport Transfer",
      description: "Reliable airport pickup and drop-off",
      price: "From $25",
      icon: "✈️",
    },
    {
      name: "Scheduled Rides",
      description: "Book rides up to 30 days in advance",
      price: "No extra fee",
      icon: "📅",
    },
    {
      name: "Corporate Accounts",
      description: "Business travel solutions",
      price: "Custom pricing",
      icon: "🏢",
    },
    {
      name: "Package Delivery",
      description: "Send packages across the city",
      price: "From $8",
      icon: "📦",
    },
  ]

  const formatPrice = (price) => `$${price.toFixed(2)}`

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mb-6">
            Simple, <span className="text-primary">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            No hidden fees, no surge pricing surprises. Choose the ride type that fits your needs and budget.
          </p>
        </div>

        {/* Vehicle Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {vehicleTypes.map((vehicle, index) => (
            <Card
              key={index}
              className={`p-8 relative ${vehicle.borderColor} border-2 ${
                vehicle.popular ? "transform scale-105 shadow-xl" : ""
              }`}
            >
              {vehicle.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                </div>
              )}

              <div className="text-center mb-6">
                <div
                  className={`w-16 h-16 ${vehicle.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                >
                  <vehicle.icon className={`w-8 h-8 ${vehicle.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-text-dark mb-2">{vehicle.name}</h3>
                <p className="text-text-secondary">{vehicle.description}</p>
              </div>

              {/* Pricing */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-text-dark mb-2">
                  {formatPrice(vehicle.basePrice)}
                  <span className="text-lg font-normal text-text-secondary"> base</span>
                </div>
                <div className="text-sm text-text-secondary">
                  + {formatPrice(vehicle.perKm)}/km + {formatPrice(vehicle.perMinute)}/min
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {vehicle.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-secondary text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={vehicle.popular ? "primary" : "outline"}
                className={`w-full ${!vehicle.popular ? "bg-transparent" : ""}`}
              >
                Choose {vehicle.name}
              </Button>
            </Card>
          ))}
        </div>

        {/* Price Calculator */}
        <Card className="p-8 mb-16 bg-bg-main">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-text-dark mb-4">Estimate Your Fare</h3>
            <p className="text-text-secondary">Get an instant price estimate for your trip</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Pickup location"
                className="w-full px-4 py-3 bg-white border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Destination"
                className="w-full px-4 py-3 bg-white border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="text-center">
              <Button icon={<Zap className="w-4 h-4" />}>Calculate Fare</Button>
            </div>
          </div>
        </Card>

        {/* Additional Services */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-text-dark mb-4">Additional Services</h3>
            <p className="text-text-secondary">More ways we can help you get around</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h4 className="text-lg font-semibold text-text-dark mb-2">{service.name}</h4>
                <p className="text-text-secondary text-sm mb-4">{service.description}</p>
                <div className="text-primary font-semibold">{service.price}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Guarantee */}
        <Card className="p-8 text-center bg-gradient-to-r from-primary to-text-secondary text-white">
          <h3 className="text-2xl font-bold mb-4">Our Price Promise</h3>
          <p className="text-lg opacity-90 mb-6">
            No hidden fees, no surge pricing during peak hours. What you see is what you pay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Transparent pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>No surge pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Upfront fare estimates</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default Pricing
