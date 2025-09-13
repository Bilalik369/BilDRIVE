import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Card from "../ui/Card"
import { loginUser, clearError, resendVerificationEmail } from "../../redux/slices/authSlice"
import SocialLogin from "./SocialLogin"

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showResendForm, setShowResendForm] = useState(false)
  const [resendEmail, setResendEmail] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loading, error } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  React.useEffect(() => {
    if (error) {
      window.showToast?.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  
  useEffect(() => {
    const verified = searchParams.get("verified")
    if (verified === "true") {
      window.showToast?.success("Email verified successfully! You can now log in.")
    }
  }, [searchParams])

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginUser(data)).unwrap()
      window.showToast?.success("Login successful! Welcome back!")

     
      if (result.user.role === "driver") {
        navigate("/driver/dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (error) {
      
    }
  }

  const handleResendVerification = async () => {
    if (!resendEmail) {
      window.showToast?.error("Please enter your email address")
      return
    }
    
    try {
      await dispatch(resendVerificationEmail(resendEmail)).unwrap()
      window.showToast?.success("Verification email sent successfully! Please check your inbox.")
      setShowResendForm(false)
      setResendEmail("")
    } catch (error) {
      // Handle specific error messages
      if (error === "EMAIL_NOT_FOUND") {
        window.showToast?.error("Email address not found in our system")
      } else if (error === "EMAIL_ALREADY_VERIFIED") {
        window.showToast?.error("Email address is already verified")
      } else if (error === "EMAIL_REQUIRED") {
        window.showToast?.error("Please enter your email address")
      } else {
        window.showToast?.error(error || "Failed to send verification email")
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-dark">Welcome Back</h2>
          <p className="mt-2 text-text-secondary">Sign in to your account to continue</p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email Address"
              type="text"
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

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                icon={<Lock className="w-5 h-5" />}
                error={errors.password?.message}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-border-color rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                  Remember me
                </label>
              </div>

              <Link to="/auth/forgot-password" className="text-sm text-primary hover:text-text-primary font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

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
              Don't have an account?{" "}
              <Link to="/auth/register" className="font-medium text-primary hover:text-text-primary">
                Sign up here
              </Link>
            </p>
            
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowResendForm(!showResendForm)}
                className="text-sm text-primary hover:text-text-primary font-medium transition-colors duration-200"
              >
                Need to resend verification email?
              </button>
            </div>

            {showResendForm && (
              <div className="mt-4 p-6 bg-card-bg border border-border-color rounded-xl">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-text-dark mb-2">Resend Verification Email</h3>
                  <p className="text-sm text-text-secondary">
                    Enter your email address to receive a new verification link
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    icon={<Mail className="w-5 h-5" />}
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                  />
                  
                  <Button
                    type="button"
                    onClick={handleResendVerification}
                    className="w-full"
                    size="md"
                  >
                    Resend Verification Email
                  </Button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border-color">
                  <button
                    type="button"
                    onClick={() => setShowResendForm(false)}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginForm
