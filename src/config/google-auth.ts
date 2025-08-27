// Google OAuth Configuration
// Replace GOOGLE_CLIENT_ID with your actual Google Client ID
export const GOOGLE_CONFIG = {
  clientId: "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com",
  // Add your domain here when deploying
  redirectUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
};

// Google Identity Services types
export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

// Decode JWT token to get user info
export const decodeGoogleCredential = (credential: string): GoogleUserInfo => {
  const base64Url = credential.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
};