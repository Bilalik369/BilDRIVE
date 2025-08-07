"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "react-hot-toast"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Card from "../ui/Card"
import { loginUser, clearError } from "../../redux/slices/authSlice"
// import SocialLogin from "./SocialLogin"

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  React.useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginUser(data)).unwrap()
      toast.success("Login successful!")

     
      if (result.user.role === "driver") {
        navigate("/driver/dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (error) {
      
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
              {/* <SocialLogin /> */}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Don't have an account?{" "}
              <Link to="/auth/register" className="font-medium text-primary hover:text-text-primary">
                Sign up here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginForm
