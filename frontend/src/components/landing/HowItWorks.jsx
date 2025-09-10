import { Download, MapPin, Car, Star } from "lucide-react"
import Card from "../ui/Card"

const HowItWorks = () => {
  const passengerSteps = [
    {
      step: 1,
      icon: Download,
      title: "Download & Register",
      description: "Download the Bildrive app and create your account in minutes",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      step: 2,
      icon: MapPin,
      title: "Set Your Destination",
      description: "Enter your pickup location and where you want to go",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      step: 3,
      icon: Car,
      title: "Get Matched",
      description: "We'll find the nearest driver and show you their details",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      step: 4,
      icon: Star,
      title: "Enjoy Your Ride",
      description: "Sit back, relax, and enjoy your safe journey",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ]

  const driverSteps = [
    {
      step: 1,
      icon: Download,
      title: "Sign Up & Get Verified",
      description: "Complete your driver application and document verification",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      step: 2,
      icon: Car,
      title: "Go Online",
      description: "Turn on your availability when you're ready to drive",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      step: 3,
      icon: MapPin,
      title: "Accept Ride Requests",
      description: "Receive and accept ride requests from nearby passengers",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      step: 4,
      icon: Star,
      title: "Earn Money",
      description: "Complete rides and earn money with flexible working hours",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <section id="how-it-works" className="relative bg-gradient-to-br from-bg-main via-white to-card-bg py-20">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-text-secondary opacity-10 rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mb-6">
            How <span className="text-primary">Bildrive</span> Works
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Getting started is easy! Whether you're looking for a ride or want to drive and earn, we've made the process
            simple and straightforward.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-bg-main rounded-xl p-2 inline-flex">
            <button className="px-6 py-3 rounded-lg bg-primary text-white font-medium transition-all">
              For Passengers
            </button>
            <button className="px-6 py-3 rounded-lg text-text-secondary hover:text-text-primary font-medium transition-all">
              For Drivers
            </button>
          </div>
        </div>

        {/* Passenger Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {passengerSteps.map((step, index) => (
            <Card key={index} className="text-center p-8 relative">
              {/* Step number */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                {step.step}
              </div>

              <div
                className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4`}
              >
                <step.icon className={`w-8 h-8 ${step.color}`} />
              </div>

              <h3 className="text-xl font-semibold text-text-dark mb-4">{step.title}</h3>
              <p className="text-text-secondary leading-relaxed">{step.description}</p>

              {/* Connector line */}
              {index < passengerSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border-color"></div>
              )}
            </Card>
          ))}
        </div>

        {/* Driver Steps Preview */}
        <div className="bg-bg-main rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-text-dark mb-4">Want to Drive and Earn?</h3>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Join thousands of drivers who are earning flexible income with Bildrive. Set your own schedule and be your
              own boss.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {driverSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 ${step.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <h4 className="text-lg font-semibold text-text-dark mb-2">{step.title}</h4>
                <p className="text-text-secondary text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
