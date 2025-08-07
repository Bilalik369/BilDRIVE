import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { verifyEmail } from "../../redux/slices/authSlice"
import { toast } from "react-hot-toast"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import { CheckCircle, XCircle, Loader } from "lucide-react"

const EmailVerification = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [status, setStatus] = useState("verifying") 
  const [message, setMessage] = useState("")

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        await dispatch(verifyEmail(token)).unwrap()
        setStatus("success")
        setMessage("Email verified successfully! You can now log in to your account.")
        toast.success("Email verified successfully!")
      } catch (error) {
        setStatus("error")
        setMessage(error || "Email verification failed. The link may be invalid or expired.")
        toast.error("Email verification failed")
      }
    }

    if (token) {
      verifyEmailToken()
    }
  }, [token, dispatch])

  const handleRedirectToLogin = () => {
    navigate("/auth/login")
  }

  const handleRedirectToRegister = () => {
    navigate("/auth/register")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="p-8 text-center">
          {status === "verifying" && (
            <div className="space-y-4">
              <Loader className="w-16 h-16 mx-auto animate-spin text-primary" />
              <h2 className="text-2xl font-bold text-text-dark">Verifying Email</h2>
              <p className="text-text-secondary">Please wait while we verify your email address...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <h2 className="text-2xl font-bold text-text-dark">Email Verified!</h2>
              <p className="text-text-secondary">{message}</p>
              <Button onClick={handleRedirectToLogin} className="w-full" size="lg">
                Continue to Login
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <XCircle className="w-16 h-16 mx-auto text-red-500" />
              <h2 className="text-2xl font-bold text-text-dark">Verification Failed</h2>
              <p className="text-text-secondary">{message}</p>
              <div className="space-y-3">
                <Button onClick={handleRedirectToLogin} className="w-full" size="lg">
                  Go to Login
                </Button>
                <Button 
                  onClick={handleRedirectToRegister} 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                >
                  Create New Account
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default EmailVerification 