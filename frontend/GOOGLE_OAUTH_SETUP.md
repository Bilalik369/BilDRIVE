# Google OAuth Setup Guide

This guide explains how to set up Google OAuth login for the Bildrive application.

## Prerequisites

1. **Google Cloud Console Account**: You need a Google Cloud account to create OAuth credentials
2. **Domain Verification**: Your domain should be verified with Google (for production)

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
- Visit [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select an existing one

### 1.2 Enable Google+ API
- Go to "APIs & Services" > "Library"
- Search for "Google+ API" and enable it
- Also enable "Google Identity" if available

### 1.3 Create OAuth 2.0 Credentials
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "OAuth 2.0 Client IDs"
- Choose "Web application" as the application type

### 1.4 Configure OAuth Consent Screen
- Set application name (e.g., "Bildrive")
- Add your domain to authorized domains
- Add scopes: `email`, `profile`, `openid`

### 1.5 Set Authorized Redirect URIs
For development:
- `https://frontend-bildrive-ckhhdbfjg7g0bzhw.francecentral-01.azurewebsites.net`
- `https://frontend-bildrive-ckhhdbfjg7g0bzhw.francecentral-01.azurewebsites.net/auth/login`
- `https://frontend-bildrive-ckhhdbfjg7g0bzhw.francecentral-01.azurewebsites.net/auth/register`

For production:
- `https://yourdomain.com`
- `https://yourdomain.com/auth/login`
- `https://yourdomain.com/auth/register`

### 1.6 Get Your Client ID
- Copy the generated Client ID
- You'll need this for the next step

## Step 2: Environment Configuration

### 2.1 Frontend Environment Variables
Create or update your `.env` file in the frontend directory:

```bash
# .env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Note**: For Create React App, use `REACT_APP_` prefix. For Next.js, use `NEXT_PUBLIC_` prefix.

### 2.2 Backend Environment Variables
Update your backend `.env` file:

```bash
# .env
GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Step 3: Install Dependencies

```bash
cd frontend
npm install @react-oauth/google
```

## Step 4: Code Implementation

### 4.1 App.js Configuration
The app is already wrapped with `GoogleOAuthProvider`:

```jsx
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {/* Your app components */}
    </GoogleOAuthProvider>
  );
}
```

### 4.2 SocialLogin Component
The component is already implemented with:
- Google OAuth login using `useGoogleLogin` hook
- Proper error handling
- Success flow with JWT token storage
- User role-based redirection

### 4.3 Backend Integration
The backend already supports:
- `/api/auth/social-login` endpoint
- Google ID token verification
- User creation/login
- JWT token generation

## Step 5: Testing

### 5.1 Development Testing
1. Start your frontend: `npm start`
2. Start your backend: `npm start`
3. Go to login/register page
4. Click "Continue with Google"
5. Complete Google OAuth flow
6. Verify successful login and redirection

### 5.2 Common Issues & Solutions

#### Issue: "Invalid client" error
**Solution**: Check that your Client ID matches exactly in both frontend and backend

#### Issue: "Redirect URI mismatch" error
**Solution**: Add your exact redirect URI to Google Cloud Console

#### Issue: "Google+ API not enabled" error
**Solution**: Enable Google+ API in Google Cloud Console

#### Issue: "CORS errors" in development
**Solution**: Ensure your backend allows requests from `https://frontend-bildrive-ckhhdbfjg7g0bzhw.francecentral-01.azurewebsites.net`

## Step 6: Production Deployment

### 6.1 Update Redirect URIs
- Remove localhost URIs from Google Cloud Console
- Add your production domain URIs
- Update environment variables on your hosting platform

### 6.2 Security Considerations
- Never commit `.env` files to version control
- Use HTTPS in production
- Regularly rotate OAuth credentials
- Monitor OAuth usage in Google Cloud Console

## Troubleshooting

### Debug Mode
Enable debug logging in your browser console to see OAuth flow details.

### Network Tab
Check the Network tab in DevTools to see API calls and responses.

### Google Cloud Console
Monitor OAuth consent screen and credentials for any configuration issues.

## Support

If you encounter issues:
1. Check Google Cloud Console for error messages
2. Verify environment variables are loaded correctly
3. Check browser console for JavaScript errors
4. Verify backend logs for API errors

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google Package](https://www.npmjs.com/package/@react-oauth/google)
- [Google Cloud Console Help](https://cloud.google.com/apis/docs/overview)
