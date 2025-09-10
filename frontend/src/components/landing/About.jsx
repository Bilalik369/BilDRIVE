import { Users, Award, Globe, TrendingUp } from "lucide-react"
import Button from "../ui/Button"
import Card from "../ui/Card"
import Lottie from "lottie-react"
import nedAnimation from "../../assete/NEdD2P1pms.json"

const About = () => {
  const stats = [
    {
      icon: Users,
      value: "2M+",
      label: "Active Users",
      description: "Trusted by millions worldwide",
    },
    {
      icon: Award,
      value: "5+",
      label: "Years Experience",
      description: "Leading the industry since 2019",
    },
    {
      icon: Globe,
      value: "50+",
      label: "Cities",
      description: "Operating across multiple countries",
    },
    {
      icon: TrendingUp,
      value: "99.9%",
      label: "Uptime",
      description: "Reliable service you can count on",
    },
  ]

  const values = [
    {
      title: "Safety First",
      description: "Every decision we make prioritizes the safety and security of our users.",
    },
    {
      title: "Innovation",
      description: "We continuously innovate to provide the best transportation solutions.",
    },
    {
      title: "Sustainability",
      description: "Committed to reducing carbon footprint through shared mobility.",
    },
    {
      title: "Community",
      description: "Building stronger communities by connecting people and places.",
    },
  ]

  return (
    <section id="about" className="relative bg-gradient-to-br from-bg-main via-white to-card-bg py-20">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-text-secondary opacity-10 rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mb-6">
            About <span className="text-primary">Bildrive</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            We're on a mission to revolutionize transportation by making it more accessible, affordable, and sustainable
            for everyone.
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left content */}
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold text-text-dark mb-6">Transforming Urban Mobility</h3>
            <div className="space-y-4 text-text-secondary">
              <p>
                Founded in 2019, Bildrive has grown from a simple idea to a global platform that connects millions of
                riders with reliable drivers. Our journey began with a vision to make transportation more efficient and
                accessible for everyone.
              </p>
              <p>
                Today, we operate in over 50 cities worldwide, facilitating millions of rides every month. Our
                technology-driven approach ensures that you get a safe, comfortable, and affordable ride whenever you
                need it.
              </p>
              <p>
                We believe that transportation should be a service, not a burden. That's why we've built a platform that
                puts users first, with features designed around your needs and preferences.
              </p>
            </div>
            <div className="mt-8">
              <Button size="lg">Learn More About Us</Button>
            </div>
          </div>

          {/* Right content - Lottie animation */}
          <div className="relative">
            <div className="w-full h-96 flex items-center justify-center overflow-hidden">
              <Lottie animationData={nedAnimation} loop autoplay style={{ width: "100%", height: "100%" }} />
            </div>
          </div>
        </div>

        {/* Values section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl lg:text-3xl font-bold text-text-dark mb-6">Our Core Values</h3>
          <p className="text-text-secondary max-w-2xl mx-auto">
            These principles guide everything we do and help us build a better future for transportation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="p-8">
              <h4 className="text-xl font-semibold text-text-dark mb-4">{value.title}</h4>
              <p className="text-text-secondary">{value.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
