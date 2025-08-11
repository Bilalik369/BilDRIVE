import React, { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Lock, CheckCircle, ArrowLeft } from "lucide-react"
import { toast } from "react-hot-toast"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Card from "../ui/Card"
import { authApi } from "../../redux/api/authApi"

const ResetPasswordForm = () => {
  const { token } = useParams()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch("password")

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authApi.resetPassword(token, data.password)
      toast.success("Password reset successfully!")
      setSuccess(true)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-text-dark">Password Reset Successful</h2>
            <p className="mt-2 text-text-secondary">You can now log in with your new password.</p>
          </div>

          <Card className="p-8 text-center">
            <Link to="/auth/login" className="inline-flex items-center gap-2 text-primary hover:text-text-primary font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
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
          <p className="mt-2 text-text-secondary">Enter a new password below to reset your account.</p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="New Password"
              type="password"
              placeholder="Create a new password"
              icon={<Lock className="w-5 h-5" />}
              error={errors.password?.message}
              showPasswordToggle
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: "Include uppercase, lowercase, and a number",
                },
              })}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your new password"
              icon={<Lock className="w-5 h-5" />}
              error={errors.confirmPassword?.message}
              showPasswordToggle
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
            />

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Reset Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default ResetPasswordForm
