import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import Button from "../ui/Button"
import Lottie from "lottie-react"
import waitingCar from "../../assete/Man waiting car.json"

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-bg-main via-white to-card-bg min-h-screen flex items-center overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-text-secondary opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-dark leading-tight mb-6">
              Your Ride,
              <span className="text-primary"> Your Way</span>
              <br />
              <span className="text-text-secondary">Anytime</span>
            </h1>

            <p className="text-lg sm:text-xl text-text-secondary mb-8 max-w-2xl">
              Experience the future of transportation with Bildrive. Safe, reliable, and affordable rides at your
              fingertips. Join millions who trust us for their daily commute.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/auth/register?type=passenger">
                <Button size="lg" className="w-full sm:w-auto" icon={<ArrowRight className="w-5 h-5" />}>
                  Book Your Ride
                </Button>
              </Link>
              <Link to="/auth/register?type=driver">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  Become a Driver
                </Button>
              </Link>
            </div>
          </div>

          {/* Right content - Lottie animation only (no purple background) */}
          <div className="relative animate-fade-in">
            <div className="relative">
              <div className="w-full h-96 lg:h-[500px] flex items-center justify-center">
                <Lottie animationData={waitingCar} loop autoplay style={{ width: "100%", height: "100%" }} />
              </div>

              {/* Removed floating decorative elements as requested */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
