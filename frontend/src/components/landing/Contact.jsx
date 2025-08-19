import { Mail, Phone, MapPin } from "lucide-react"
import Card from "../ui/Card"
import Button from "../ui/Button"

const Contact = () => {
  return (
    <section className="py-20 bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mb-4">Contact Us</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            We'd love to hear from you. Reach out for any questions or support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-text-dark mb-1">Email</h3>
            <p className="text-text-secondary">support@bildrive.com</p>
          </Card>
          <Card className="p-6 text-center">
            <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-text-dark mb-1">Phone</h3>
            <p className="text-text-secondary">+1 (555) 123-4567</p>
          </Card>
          <Card className="p-6 text-center">
            <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-text-dark mb-1">Address</h3>
            <p className="text-text-secondary">123 Business Ave, City, State</p>
          </Card>
        </div>

        <div className="text-center mt-10">
          <Button>Send a Message</Button>
        </div>
      </div>
    </section>
  )
}

export default Contact


