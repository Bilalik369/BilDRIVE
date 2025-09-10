import { Check, Car, Crown } from "lucide-react"
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


  const formatPrice = (price) => `${price.toFixed(2)} DH`

  return (
    <section id="pricing" className="relative bg-gradient-to-br from-bg-main via-white to-card-bg py-20">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-text-secondary opacity-10 rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
