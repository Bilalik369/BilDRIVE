import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { User, Mail, Lock, Phone, Car, FileText } from "lucide-react"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Card from "../ui/Card"
import { registerUser, clearError } from "../../redux/slices/authSlice"
import SocialLogin from "./SocialLogin"

const RegisterForm = () => {
  const [searchParams] = useSearchParams()
  const [userType, setUserType] = useState(searchParams.get("type") || "passenger")
  const [step, setStep] = useState(1)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: userType,
    },
  })

  const password = watch("password")

  React.useEffect(() => {
    
    setValue("role", userType)
  }, [userType, setValue])

  React.useEffect(() => {
    if (error) {
      window.showToast?.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const onSubmit = async (data) => {
    try {
      const submitData = {
        ...data,
        role: userType
      }
      
      console.log("Frontend - userType:", userType)
      console.log("Frontend - form data:", data)
      console.log("Frontend - submitting data:", submitData) 
      
      const result = await dispatch(registerUser(submitData)).unwrap()
      console.log("Frontend - registration result:", result)
      
      window.showToast?.success("Registration successful! Please check your email for verification before logging in.")
      
      
      navigate("/auth/login")
    } catch (error) {
      console.error("Frontend - registration error:", error)
    }
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-dark">Create Your Account</h2>
          <p className="mt-2 text-text-secondary">Join thousands of users who trust Bildrive</p>
        </div>

        {/* User type selection */}
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            variant={userType === "passenger" ? "primary" : "outline"}
            onClick={() => {
              setUserType("passenger")
              setValue("role", "passenger")
            }}
            icon={<User className="w-4 h-4" />}
          >
            Passenger
          </Button>
          <Button
            variant={userType === "driver" ? "primary" : "outline"}
            onClick={() => {
              setUserType("driver")
              setValue("role", "driver")
            }}
            icon={<Car className="w-4 h-4" />}
          >
            Driver
          </Button>
        </div>

        <Card className="p-8">
          {/* Progress indicator */}
          {userType === "driver" && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">
                  Step {step} of {userType === "driver" ? "2" : "1"}
                </span>
                <span className="text-sm text-text-secondary">
                  {step === 1 ? "Personal Information" : "Driver Details"}
                </span>
              </div>
              <div className="w-full bg-border-color rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / (userType === "driver" ? 2 : 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <input type="hidden" {...register("role")} value={userType} />

            {step === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    placeholder="Enter your first name"
                    icon={<User className="w-5 h-5" />}
                    error={errors.firstName?.message}
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "First name cannot exceed 50 characters",
                      },
                    })}
                  />

                  <Input
                    label="Last Name"
                    placeholder="Enter your last name"
                    icon={<User className="w-5 h-5" />}
                    error={errors.lastName?.message}
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Last name cannot exceed 50 characters",
                      },
                    })}
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
                      value: /^\S+@\S+\.\S+$/,
                      message: "Please enter a valid email",
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

                <Input
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  icon={<Lock className="w-5 h-5" />}
                  error={errors.password?.message}
                  showPasswordToggle
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                    },
                  })}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  icon={<Lock className="w-5 h-5" />}
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                />

                {userType === "driver" ? (
                  <Button type="button" onClick={nextStep} className="w-full" size="lg">
                    Next Step
                  </Button>
                ) : (
                  <Button type="submit" loading={loading} className="w-full" size="lg">
                    Create Account
                  </Button>
                )}
              </>
            )}

            {step === 2 && userType === "driver" && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-text-dark">Driver Information</h3>
                  <p className="text-text-secondary">Please provide your driver and vehicle details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="License Number"
                    placeholder="Enter license number"
                    icon={<FileText className="w-5 h-5" />}
                    error={errors.licenseNumber?.message}
                    {...register("licenseNumber", {
                      required: "License number is required",
                    })}
                  />

                  <Input
                    label="License Expiry"
                    type="date"
                    error={errors.licenseExpiry?.message}
                    {...register("licenseExpiry", {
                      required: "License expiry date is required",
                      validate: (value) => {
                        const selectedDate = new Date(value);
                        const today = new Date();
                        return selectedDate > today || "License expiry date must be in the future";
                      },
                    })}
                  />
                </div>

                <Input
                  label="ID Card Number"
                  placeholder="Enter ID card number"
                  icon={<FileText className="w-5 h-5" />}
                  error={errors.idCard?.message}
                  {...register("idCard", {
                    required: "ID card number is required",
                  })}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Vehicle Type</label>
                    <select
                      className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      {...register("vehicleType", {
                        required: "Vehicle type is required",
                      })}
                    >
                      <option value="">Select vehicle type</option>
                      <option value="standard">Standard</option>
                      <option value="comfort">Comfort</option>
                      <option value="premium">Premium</option>
                      <option value="van">Van</option>
                    </select>
                    {errors.vehicleType && <p className="mt-1 text-sm text-red-500">{errors.vehicleType.message}</p>}
                  </div>

                  <Input
                    label="Vehicle Make"
                    placeholder="e.g., Toyota"
                    error={errors.vehicleMake?.message}
                    {...register("vehicleMake", {
                      required: "Vehicle make is required",
                    })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Vehicle Model"
                    placeholder="e.g., Camry"
                    error={errors.vehicleModel?.message}
                    {...register("vehicleModel", {
                      required: "Vehicle model is required",
                    })}
                  />

                  <Input
                    label="Vehicle Year"
                    type="number"
                    placeholder="e.g., 2020"
                    error={errors.vehicleYear?.message}
                    {...register("vehicleYear", {
                      required: "Vehicle year is required",
                      min: {
                        value: 2010,
                        message: "Vehicle must be 2010 or newer",
                      },
                      max: {
                        value: new Date().getFullYear() + 1,
                        message: "Invalid vehicle year",
                      },
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Vehicle Color"
                    placeholder="e.g., White"
                    error={errors.vehicleColor?.message}
                    {...register("vehicleColor", {
                      required: "Vehicle color is required",
                    })}
                  />

                  <Input
                    label="License Plate"
                    placeholder="Enter license plate"
                    error={errors.vehicleLicensePlate?.message}
                    {...register("vehicleLicensePlate", {
                      required: "License plate is required",
                    })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Insurance Number"
                    placeholder="Enter insurance number"
                    error={errors.vehicleInsuranceNumber?.message}
                    {...register("vehicleInsuranceNumber", {
                      required: "Insurance number is required",
                    })}
                  />

                  <Input
                    label="Insurance Expiry"
                    type="date"
                    error={errors.vehicleInsuranceExpiry?.message}
                    {...register("vehicleInsuranceExpiry", {
                      required: "Insurance expiry date is required",
                      validate: (value) => {
                        const selectedDate = new Date(value);
                        const today = new Date();
                        return selectedDate > today || "Insurance expiry date must be in the future";
                      },
                    })}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 bg-transparent">
                    Previous
                  </Button>
                  <Button type="submit" loading={loading} className="flex-1" size="lg">
                    register
                  </Button>
                </div>
              </>
            )}
          </form>

          {step === 1 && (
            <>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-color" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-text-secondary">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <SocialLogin />
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-text-secondary">
                  Already have an account?{" "}
                  <Link to="/auth/login" className="font-medium text-primary hover:text-text-primary">
                    Sign in here
                  </Link>
                </p>
              </div>
            </>
          )}

          <div className="mt-6 text-xs text-text-secondary text-center">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default RegisterForm