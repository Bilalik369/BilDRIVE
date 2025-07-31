"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { User, Car, FileText, Star, Camera, Save } from "lucide-react"
import { toast } from "react-hot-toast"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Card from "../../components/ui/Card"
import { useAuth } from "../../hooks/useAuth"

const DriverProfile = () => {
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
      licenseNumber: user?.driverProfile?.licenseNumber || "",
      vehicleMake: user?.driverProfile?.vehicle?.make || "",
      vehicleModel: user?.driverProfile?.vehicle?.model || "",
      vehicleYear: user?.driverProfile?.vehicle?.year || "",
      vehicleColor: user?.driverProfile?.vehicle?.color || "",
      licensePlate: user?.driverProfile?.vehicle?.licensePlate || "",
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // API call to update driver profile
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "vehicle", label: "Vehicle Info", icon: Car },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "ratings", label: "Ratings & Reviews", icon: Star },
  ]

  const driverStats = {
    totalRides: 1247,
    rating: 4.8,
    totalEarnings: 15420.5,
    completionRate: 98.5,
    responseTime: "2 min",
    acceptanceRate: 92,
  }

  const recentReviews = [
    {
      id: 1,
      passenger: "Sarah J.",
      rating: 5,
      comment: "Great driver! Very professional and friendly. Clean car and smooth ride.",
      date: "2024-01-15",
    },
    {
      id: 2,
      passenger: "Mike C.",
      rating: 5,
      comment: "On time pickup and safe driving. Would definitely ride again.",
      date: "2024-01-14",
    },
    {
      id: 3,
      passenger: "Emily R.",
      rating: 4,
      comment: "Good service overall. Driver was polite and helpful.",
      date: "2024-01-13",
    },
  ]

  const documents = [
    {
      name: "Driver's License",
      status: "verified",
      expiryDate: "2026-08-15",
      uploaded: "2023-01-10",
    },
    {
      name: "Vehicle Registration",
      status: "verified",
      expiryDate: "2025-12-31",
      uploaded: "2023-01-10",
    },
    {
      name: "Insurance Certificate",
      status: "verified",
      expiryDate: "2024-06-30",
      uploaded: "2023-01-10",
    },
    {
      name: "Background Check",
      status: "verified",
      expiryDate: "2024-12-31",
      uploaded: "2023-01-10",
    },
  ]

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">Driver Profile</h1>
          <p className="text-text-secondary">Manage your driver information and documents</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{driverStats.totalRides}</div>
            <div className="text-sm text-text-secondary">Total Rides</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{driverStats.rating} ★</div>
            <div className="text-sm text-text-secondary">Rating</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">${driverStats.totalEarnings.toLocaleString()}</div>
            <div className="text-sm text-text-secondary">Total Earnings</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{driverStats.completionRate}%</div>
            <div className="text-sm text-text-secondary">Completion Rate</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{driverStats.responseTime}</div>
            <div className="text-sm text-text-secondary">Avg Response</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{driverStats.acceptanceRate}%</div>
            <div className="text-sm text-text-secondary">Acceptance Rate</div>
          </Card>
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
                <p className="text-sm text-text-secondary">Professional Driver</p>
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
                      error={errors.email?.message}
                      {...register("email", { required: "Email is required" })}
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="Enter your phone number"
                      error={errors.phone?.message}
                      {...register("phone", { required: "Phone number is required" })}
                    />

                    <Input
                      label="Driver License Number"
                      placeholder="Enter your license number"
                      error={errors.licenseNumber?.message}
                      {...register("licenseNumber", { required: "License number is required" })}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" loading={loading} icon={<Save className="w-4 h-4" />}>
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "vehicle" && (
                <div>
                  <h2 className="text-xl font-semibold text-text-dark mb-6">Vehicle Information</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Make"
                        placeholder="e.g., Toyota"
                        error={errors.vehicleMake?.message}
                        {...register("vehicleMake", { required: "Vehicle make is required" })}
                      />
                      <Input
                        label="Model"
                        placeholder="e.g., Camry"
                        error={errors.vehicleModel?.message}
                        {...register("vehicleModel", { required: "Vehicle model is required" })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Year"
                        type="number"
                        placeholder="e.g., 2020"
                        error={errors.vehicleYear?.message}
                        {...register("vehicleYear", { required: "Vehicle year is required" })}
                      />
                      <Input
                        label="Color"
                        placeholder="e.g., White"
                        error={errors.vehicleColor?.message}
                        {...register("vehicleColor", { required: "Vehicle color is required" })}
                      />
                    </div>

                    <Input
                      label="License Plate"
                      placeholder="Enter license plate number"
                      error={errors.licensePlate?.message}
                      {...register("licensePlate", { required: "License plate is required" })}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" loading={loading} icon={<Save className="w-4 h-4" />}>
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "documents" && (
                <div>
                  <h2 className="text-xl font-semibold text-text-dark mb-6">Documents & Verification</h2>
                  <div className="space-y-4">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-bg-main rounded-lg">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              doc.status === "verified"
                                ? "bg-green-500"
                                : doc.status === "pending"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                          <div>
                            <h3 className="font-medium text-text-dark">{doc.name}</h3>
                            <p className="text-sm text-text-secondary">
                              Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              doc.status === "verified"
                                ? "bg-green-100 text-green-800"
                                : doc.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </span>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            Update
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "ratings" && (
                <div>
                  <h2 className="text-xl font-semibold text-text-dark mb-6">Ratings & Reviews</h2>

                  {/* Rating Summary */}
                  <Card className="p-6 mb-6 bg-bg-main">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">{driverStats.rating}</div>
                        <div className="flex justify-center gap-1 my-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Math.floor(driverStats.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-text-secondary">Overall Rating</div>
                      </div>
                      <div className="flex-1">
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-2">
                              <span className="text-sm w-8">{rating}★</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full"
                                  style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 5}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-text-secondary w-8">
                                {rating === 5 ? "70%" : rating === 4 ? "20%" : "5%"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Recent Reviews */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-dark">Recent Reviews</h3>
                    {recentReviews.map((review) => (
                      <Card key={review.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text-dark">{review.passenger}</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-text-secondary">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-text-secondary">{review.comment}</p>
                      </Card>
                    ))}
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

export default DriverProfile
