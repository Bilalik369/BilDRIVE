"use client"

import { useState } from "react"
import { Shield, Bell, CreditCard, MapPin, Trash2, Download } from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { useAuth } from "../../hooks/useAuth"

const Settings = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("privacy")

  const tabs = [
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payments", label: "Payment Methods", icon: CreditCard },
    { id: "locations", label: "Saved Places", icon: MapPin },
    { id: "data", label: "Data & Privacy", icon: Download },
  ]

  const privacySettings = [
    {
      title: "Profile Visibility",
      description: "Control who can see your profile information",
      options: ["Public", "Friends Only", "Private"],
      current: "Friends Only",
    },
    {
      title: "Location Sharing",
      description: "Share your location with drivers during rides",
      type: "toggle",
      enabled: true,
    },
    {
      title: "Ride History Visibility",
      description: "Allow others to see your ride history",
      type: "toggle",
      enabled: false,
    },
    {
      title: "Contact Information",
      description: "Show your phone number to drivers",
      type: "toggle",
      enabled: true,
    },
  ]

  const notificationSettings = [
    {
      title: "Ride Updates",
      description: "Get notified about ride status changes",
      type: "toggle",
      enabled: true,
    },
    {
      title: "Promotional Offers",
      description: "Receive special offers and discounts",
      type: "toggle",
      enabled: true,
    },
    {
      title: "Driver Messages",
      description: "Receive messages from your driver",
      type: "toggle",
      enabled: true,
    },
    {
      title: "Email Notifications",
      description: "Receive updates via email",
      type: "toggle",
      enabled: false,
    },
    {
      title: "SMS Notifications",
      description: "Get text messages for important updates",
      type: "toggle",
      enabled: true,
    },
  ]

  const paymentMethods = [
    {
      id: 1,
      type: "card",
      last4: "4242",
      brand: "Visa",
      isDefault: true,
    },
    {
      id: 2,
      type: "card",
      last4: "8888",
      brand: "Mastercard",
      isDefault: false,
    },
  ]

  const savedPlaces = [
    {
      id: 1,
      name: "Home",
      address: "123 Main St, New York, NY 10001",
      icon: "🏠",
    },
    {
      id: 2,
      name: "Work",
      address: "456 Business Ave, New York, NY 10002",
      icon: "🏢",
    },
    {
      id: 3,
      name: "Gym",
      address: "789 Fitness Blvd, New York, NY 10003",
      icon: "💪",
    },
  ]

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">Settings</h1>
          <p className="text-text-secondary">Manage your account preferences and privacy settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
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
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-8">
              {activeTab === "privacy" && (
                <div>
                  <h2 className="text-xl font-semibold text-text-dark mb-6">Privacy & Security</h2>
                  <div className="space-y-6">
                    {privacySettings.map((setting, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-bg-main rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-text-dark">{setting.title}</h3>
                          <p className="text-sm text-text-secondary">{setting.description}</p>
                        </div>
                        <div className="ml-4">
                          {setting.type === "toggle" ? (
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          ) : (
                            <select className="px-3 py-2 border border-border-color rounded-lg text-sm">
                              {setting.options.map((option) => (
                                <option key={option} selected={option === setting.current}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-xl font-semibold text-text-dark mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    {notificationSettings.map((setting, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-bg-main rounded-lg">
                        <div>
                          <h3 className="font-medium text-text-dark">{setting.title}</h3>
                          <p className="text-sm text-text-secondary">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "payments" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-text-dark">Payment Methods</h2>
                    <Button>Add New Method</Button>
                  </div>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 bg-bg-main rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-text-dark">
                              {method.brand} •••• {method.last4}
                            </div>
                            {method.isDefault && <span className="text-xs text-primary font-medium">Default</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!method.isDefault && (
                            <Button variant="ghost" size="sm">
                              Set as Default
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "locations" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-text-dark">Saved Places</h2>
                    <Button>Add New Place</Button>
                  </div>
                  <div className="space-y-4">
                    {savedPlaces.map((place) => (
                      <div key={place.id} className="flex items-center justify-between p-4 bg-bg-main rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">{place.icon}</div>
                          <div>
                            <div className="font-medium text-text-dark">{place.name}</div>
                            <div className="text-sm text-text-secondary">{place.address}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "data" && (
                <div>
                  <h2 className="text-xl font-semibold text-text-dark mb-6">Data & Privacy</h2>
                  <div className="space-y-6">
                    <Card className="p-6 bg-bg-main">
                      <h3 className="font-semibold text-text-dark mb-2">Download Your Data</h3>
                      <p className="text-text-secondary mb-4">
                        Get a copy of all your data including ride history, profile information, and preferences.
                      </p>
                      <Button
                        variant="outline"
                        icon={<Download className="w-4 h-4 bg-transparent" />}
                        className="bg-transparent"
                      >
                        Request Data Export
                      </Button>
                    </Card>

                    <Card className="p-6 bg-bg-main">
                      <h3 className="font-semibold text-text-dark mb-2">Data Retention</h3>
                      <p className="text-text-secondary mb-4">
                        We keep your data for as long as your account is active. You can request deletion at any time.
                      </p>
                      <div className="space-y-2 text-sm text-text-secondary">
                        <div>• Ride history: Kept for 7 years for legal compliance</div>
                        <div>• Profile data: Kept until account deletion</div>
                        <div>• Payment info: Kept until you remove the payment method</div>
                      </div>
                    </Card>

                    <Card className="p-6 bg-red-50 border-red-200">
                      <h3 className="font-semibold text-red-800 mb-2">Delete Account</h3>
                      <p className="text-red-700 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button variant="danger" icon={<Trash2 className="w-4 h-4" />}>
                        Delete Account
                      </Button>
                    </Card>
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

export default Settings
