"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { User, Mail, Phone, Camera, Save, Shield, Bell } from "lucide-react"
import { toast } from "react-hot-toast"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Card from "../components/ui/Card"
import { useAuth } from "../hooks/useAuth"

const Profile = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("personal")
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // API call to update profile
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ]

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">Profile Settings</h1>
          <p className="text-text-secondary">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture || "/placeholder.svg"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-2xl font-semibold">
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <button className="absolute bottom-4 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-primary">
                    <Camera className="w-4 h-4 text-primary" />
                  </button>
                </div>
                <h3 className="font-semibold text-text-dark">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-text-secondary capitalize">{user?.role}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-text-secondary hover:bg-card-bg hover:text-text-primary"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-8">
              {activeTab === "personal" && (
                <div>
                  <h2 className="text-xl font-semibold text-text-dark mb-6">Personal Information</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="First Name"
                        placeholder="Enter your first name"
                        error={errors.firstName?.message}
                        {...register("firstName", { required: "First name is required" })}
                      />
                      <Input
                        label="Last Name"
                        placeholder="Enter your last name"
                        error={errors.lastName?.message}
                        {...register("lastName", { required: "Last name is required" })}
                      />
                    </div>

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      icon={<Mail className="w-5 h-5" />}
                      error={errors.email?.message}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="Enter your phone number"
                      icon={<Phone className="w-5 h-5" />}
                      error={errors.phone?.message}
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[+]?[\d\s\-()]+$/,
                          message: "Invalid phone number",
                        },
                      })}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" loading={loading} icon={<Save className="w-4 h-4" />}>
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "security" && (
                <div>
                  <h2 className="text-xl font-semibold text-text-dark mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <Card className="p-6 bg-bg-main">
                      <h3 className="font-semibold text-text-dark mb-2">Change Password</h3>
                      <p className="text-text-secondary mb-4">Update your password to keep your account secure</p>
                      <Button variant="outline" className="bg-transparent">
                        Change Password
                      </Button>
                    </Card>

                    <Card className="p-6 bg-bg-main">
                      <h3 className="font-semibold text-text-dark mb-2">Two-Factor Authentication</h3>
                      <p className="text-text-secondary mb-4">Add an extra layer of security to your account</p>
                      <Button variant="outline" className="bg-transparent">
                        Enable 2FA
                      </Button>
                    </Card>

                    <Card className="p-6 bg-bg-main">
                      <h3 className="font-semibold text-text-dark mb-2">Login Sessions</h3>
                      <p className="text-text-secondary mb-4">Manage your active login sessions</p>
                      <Button variant="outline" className="bg-transparent">
                        View Sessions
                      </Button>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-xl font-semibold text-text-dark mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-bg-main rounded-lg">
                        <div>
                          <h3 className="font-medium text-text-dark">Ride Updates</h3>
                          <p className="text-sm text-text-secondary">Get notified about ride status changes</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-bg-main rounded-lg">
                        <div>
                          <h3 className="font-medium text-text-dark">Email Notifications</h3>
                          <p className="text-sm text-text-secondary">Receive updates via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-bg-main rounded-lg">
                        <div>
                          <h3 className="font-medium text-text-dark">SMS Notifications</h3>
                          <p className="text-sm text-text-secondary">Get text messages for important updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-bg-main rounded-lg">
                        <div>
                          <h3 className="font-medium text-text-dark">Promotional Offers</h3>
                          <p className="text-sm text-text-secondary">Receive special offers and discounts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
