import { Link } from "react-router-dom"
import { ArrowRight, Play, Star, Users, MapPin } from "lucide-react"
import Button from "../ui/Button"

const Hero = () => {
  const stats = [
    { icon: Users, value: "2M+", label: "Happy Customers" },
    { icon: MapPin, value: "50+", label: "Cities Served" },
    { icon: Star, value: "4.9", label: "Average Rating" },
  ]

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

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border-color">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-text-dark">{stat.value}</div>
                  <div className="text-sm text-text-secondary">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right content - Hero image/illustration */}
          <div className="relative animate-fade-in">
            <div className="relative">
              {/* Main hero image placeholder */}
              <div className="w-full h-96 lg:h-[500px] bg-gradient-to-br from-primary to-text-secondary rounded-3xl shadow-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Play className="w-12 h-12" />
                  </div>
                  <p className="text-lg font-medium">Watch How It Works</p>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-bounce">
                <div className="w-8 h-8 bg-primary rounded-full"></div>
              </div>

              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.9</div>
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -left-8 w-16 h-16 bg-card-bg rounded-xl shadow-lg flex items-center justify-center">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
