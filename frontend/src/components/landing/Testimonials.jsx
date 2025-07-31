import { Star, Quote } from "lucide-react"
import Card from "../ui/Card"

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Marketing Manager",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "Bildrive has completely changed how I commute to work. The drivers are professional, the cars are clean, and the app is so easy to use. I can't imagine using any other ride service now!",
      location: "New York, NY",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Software Developer",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "As someone who doesn't own a car, Bildrive is a lifesaver. The pricing is fair, the wait times are short, and I love being able to track my ride in real-time. Highly recommended!",
      location: "San Francisco, CA",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "College Student",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "Perfect for getting around campus and the city. The student discounts are amazing, and I feel safe riding alone at night knowing all drivers are background-checked.",
      location: "Austin, TX",
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Driver Partner",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "I've been driving with Bildrive for over a year now. The flexibility is incredible - I can work when I want and the earnings are great. The support team is always helpful too.",
      location: "Chicago, IL",
    },
    {
      id: 5,
      name: "Lisa Park",
      role: "Business Owner",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "I use Bildrive for all my business trips. The premium service is worth every penny - comfortable cars, professional drivers, and always on time. It's become essential for my business.",
      location: "Los Angeles, CA",
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Retiree",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "At my age, I appreciate the convenience and safety that Bildrive provides. The drivers are courteous and patient, and I love that I can book rides for my medical appointments in advance.",
      location: "Miami, FL",
    },
  ]

  return (
    <section className="py-20 bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mb-6">
            What Our <span className="text-primary">Users Say</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Don't just take our word for it. Here's what thousands of satisfied customers and driver partners have to
            say about their Bildrive experience.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">4.9</div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <div className="text-text-secondary">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">2M+</div>
            <div className="text-text-secondary">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50K+</div>
            <div className="text-text-secondary">Driver Partners</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10M+</div>
            <div className="text-text-secondary">Rides Completed</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 relative">
              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="w-8 h-8 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-text-secondary mb-6 leading-relaxed">"{testimonial.text}"</p>

              {/* User info */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-text-dark">{testimonial.name}</div>
                  <div className="text-sm text-text-secondary">{testimonial.role}</div>
                  <div className="text-xs text-text-secondary">{testimonial.location}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-text-secondary mb-6">Join thousands of satisfied users today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Start Riding
            </button>
            <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors">
              Become a Driver
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
