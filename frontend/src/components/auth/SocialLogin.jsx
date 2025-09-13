import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
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
      
      window.showToast?.success('Google login successful! Welcome!')
      
      if (result.user.role === "driver") {
        navigate("/driver/dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (error) {
      console.error('Google login error:', error)
      window.showToast?.error(error || "Google login failed. Please try again.")
    }
  }

  const handleGoogleError = (error) => {
    console.error('Google OAuth error:', error)
    window.showToast?.error("Google authentication failed. Please try again.")
  }


  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  if (!googleClientId) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
          onClick={() => window.showToast?.error("Google login is not configured")}
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>
      </div>
    )
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