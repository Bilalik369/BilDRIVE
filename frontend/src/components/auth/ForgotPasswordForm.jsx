"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { Mail, ArrowLeft, Send } from "lucide-react"
import { toast } from "react-hot-toast"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Card from "../ui/Card"
import { forgotPassword } from "../../redux/slices/authSlice"

const ForgotPasswordForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await dispatch(forgotPassword(data.email)).unwrap()
      setIsSubmitted(true)
      toast.success("Password reset instructions sent to your email!")
    } catch (error) {
      // Handle specific error messages
      if (error === "EMAIL_NOT_FOUND") {
        toast.error("Email address not found in our system")
      } else if (error === "EMAIL_REQUIRED") {
        toast.error("Please enter your email address")
      } else {
        toast.error(error || "Failed to send reset instructions")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    const email = getValues("email")
    if (!email) return

    setLoading(true)
    try {
      await dispatch(forgotPassword(email)).unwrap()
      toast.success("Email sent again!")
    } catch (error) {
      // Handle specific error messages
      if (error === "EMAIL_NOT_FOUND") {
        toast.error("Email address not found in our system")
      } else if (error === "EMAIL_REQUIRED") {
        toast.error("Please enter your email address")
      } else {
        toast.error("Failed to resend email")
      }
    } finally {
      setLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-text-dark">Check Your Email</h2>
            <p className="mt-2 text-text-secondary">We've sent password reset instructions to your email address.</p>
          </div>

          <Card className="p-8">
            <div className="text-center space-y-4">
              <p className="text-text-secondary">
                Didn't receive the email? Check your spam folder or click below to resend.
              </p>

              <Button onClick={handleResendEmail} loading={loading} variant="outline" className="w-full bg-transparent">
                Resend Email
              </Button>

              <div className="pt-4 border-t border-border-color">
                <Link
                  to="/auth/login"
                  className="flex items-center justify-center gap-2 text-primary hover:text-text-primary font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-dark">Forgot Password?</h2>
          <p className="mt-2 text-text-secondary">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
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

            <Button type="submit" loading={loading} className="w-full" size="lg" icon={<Send className="w-4 h-4" />}>
              Send Reset Instructions
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

export default ForgotPasswordForm
