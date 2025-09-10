import { Link } from "react-router-dom"
import { Car, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: "About Us", path: "/about" },
      { label: "How It Works", path: "/how-it-works" },
      { label: "Careers", path: "/careers" },
      { label: "Press", path: "/press" },
    ],
    services: [
      { label: "Book a Ride", path: "/rides/request" },
      { label: "Become a Driver", path: "/driver/register" },
      { label: "Business", path: "/business" },
      { label: "Delivery", path: "/delivery" },
    ],
    support: [
      { label: "Help Center", path: "/help" },
      { label: "Safety", path: "/safety" },
      { label: "Contact Us", path: "/contact" },
      { label: "Lost & Found", path: "/lost-found" },
    ],
    legal: [
      { label: "Terms of Service", path: "/terms" },
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Cookie Policy", path: "/cookies" },
      { label: "Accessibility", path: "/accessibility" },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ]

  return (
    <footer className="bg-text-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <Car className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">Bildrive</span>
              </Link>
              <p className="text-gray-300 mb-6 max-w-md">
                Your reliable ride-sharing partner. Safe, affordable, and convenient transportation at your fingertips.
                Join millions of satisfied customers worldwide.
              </p>

              {/* Contact info */}
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+212 6052-28740</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@bildrive.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>123 Business Ave, Beni mellal,</span>
                </div>
              </div>
            </div>

            {/* Links sections */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-gray-300 hover:text-primary transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-gray-300 hover:text-primary transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-gray-300 hover:text-primary transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-gray-300 hover:text-primary transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0">© {currentYear} Bildrive. All rights reserved.</p>

            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-primary transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
