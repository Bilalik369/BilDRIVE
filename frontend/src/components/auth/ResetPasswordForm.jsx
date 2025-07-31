"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react"
import { toast } from "react-hot-toast"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Card from "../ui/Card"
import { authApi } from "../../redux/api/authApi"

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)

  const { token } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch("password")

  useEffect(() => {
    // Validate token on component mount
    if (!token) {
      setTokenValid(false)
      toast.error("Invalid reset link")
    }
  }, [token])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authApi.resetPassword(token, data.password)
      setIsSuccess(true)
      toast.success("Password reset successfully!")

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/auth/login")
      }, 3000)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password")
      if (error.response?.status === 400) {
        setTokenValid(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" }

    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    const levels = [
      { label: "Very Weak", color: "bg-red-500" },
      { label: "Weak", color: "bg-red-400" },
      { label: "Fair", color: "bg-yellow-500" },
      { label: "Good", color: "bg-blue-500" },
      { label: "Strong", color: "bg-green-500" },
    ]

    return { strength, ...levels[strength] }
  }

  const passwordStrength = getPasswordStrength(password)

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-text-dark mb-4">Invalid Reset Link</h2>
            <p className="text-text-secondary mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link to="/auth/forgot-password">
              <Button className="w-full">Request New Reset Link</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-text-dark mb-4">Password Reset Successful!</h2>
            <p className="text-text-secondary mb-6">
              Your password has been successfully reset. You will be redirected to the login page shortly.
            </p>
            <Link to="/auth/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-dark">Reset Your Password</h2>
          <p className="mt-2 text-text-secondary">Enter your new password below to complete the reset process.</p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                icon={<Lock className="w-5 h-5" />}
                error={errors.password?.message}
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
              <button
                type="button"
                className="absolute right-3 top-9 text-placeholder-text hover:text-text-primary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Password Strength</span>
                  <span className={`font-medium ${passwordStrength.strength >= 3 ? "text-green-600" : "text-red-600"}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="relative">
              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                icon={<Lock className="w-5 h-5" />}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-placeholder-text hover:text-text-primary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="bg-bg-main rounded-lg p-4">
              <h4 className="text-sm font-medium text-text-dark mb-2">Password Requirements:</h4>
              <ul className="text-xs text-text-secondary space-y-1">
                <li className={`flex items-center gap-2 ${password?.length >= 8 ? "text-green-600" : ""}`}>
                  <div
                    className={`w-2 h-2 rounded-full ${password?.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  At least 8 characters long
                </li>
                <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? "text-green-600" : ""}`}>
                  <div
                    className={`w-2 h-2 rounded-full ${/[A-Z]/.test(password) ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  One uppercase letter
                </li>
                <li className={`flex items-center gap-2 ${/[a-z]/.test(password) ? "text-green-600" : ""}`}>
                  <div
                    className={`w-2 h-2 rounded-full ${/[a-z]/.test(password) ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  One lowercase letter
                </li>
                <li className={`flex items-center gap-2 ${/\d/.test(password) ? "text-green-600" : ""}`}>
                  <div className={`w-2 h-2 rounded-full ${/\d/.test(password) ? "bg-green-500" : "bg-gray-300"}`}></div>
                  One number
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
              disabled={passwordStrength.strength < 3}
            >
              Reset Password
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Remember your password?{" "}
              <Link to="/auth/login" className="font-medium text-primary hover:text-text-primary">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ResetPasswordForm
