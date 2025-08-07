import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react"
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
  
  const { token } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch("password")

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Lien de réinitialisation invalide")
      return
    }

    setLoading(true)
    try {
      await authApi.resetPassword(token, data.password)
      setIsSuccess(true)
      toast.success("Mot de passe réinitialisé avec succès !")
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la réinitialisation du mot de passe")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate("/auth/login")
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-text-dark">Password Reset Successfully!</h2>
            <p className="mt-2 text-text-secondary">Your password has been updated. You can now log in with your new password.</p>
          </div>

          <Card className="p-8">
            <div className="text-center space-y-4">
              <Button onClick={handleBackToLogin} className="w-full" size="lg">
                Continue to Login
              </Button>

              <div className="pt-4 border-t border-border-color">
                <Link
                  to="/auth/register"
                  className="flex items-center justify-center gap-2 text-primary hover:text-text-primary font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Create New Account
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
          <h2 className="text-3xl font-bold text-text-dark">Reset Your Password</h2>
          <p className="mt-2 text-text-secondary">
            Enter your new password below.
          </p>
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

            <Button type="submit" loading={loading} className="w-full" size="lg">
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