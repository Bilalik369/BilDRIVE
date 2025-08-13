import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { toast } from "react-hot-toast"
import { socialLogin } from "../../redux/slices/authSlice"

const SocialLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential
      
      const result = await dispatch(socialLogin({ 
        provider: 'google', 
        token: idToken 
      })).unwrap()
      
      toast.success('Google login successful!')
      
      if (result.user.role === "driver") {
        navigate("/driver/dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (error) {
      console.error('Google login error:', error)
      toast.error(error || "Google login failed. Please try again.")
    }
  }

  const handleGoogleError = (error) => {
    console.error('Google OAuth error:', error)
    toast.error("Google authentication failed. Please try again.")
  }

  return (
    <div className="space-y-3">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="100%"
      />
    </div>
  )
}

export default SocialLogin