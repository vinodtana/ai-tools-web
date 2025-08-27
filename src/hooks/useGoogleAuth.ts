import { useEffect, useState } from 'react';
import { GOOGLE_CONFIG, decodeGoogleCredential, GoogleCredentialResponse, GoogleUserInfo } from '@/config/google-auth';

declare global {
  interface Window {
    google: any;
    googleCredentialCallback: (response: GoogleCredentialResponse) => void;
  }
}

export const useGoogleAuth = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => {
      if (window.google) {
        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CONFIG.clientId,
          callback: (response: GoogleCredentialResponse) => {
            window.googleCredentialCallback(response);
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        setIsGoogleLoaded(true);
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const signInWithGoogle = (): Promise<GoogleUserInfo> => {
    return new Promise((resolve, reject) => {
      if (!isGoogleLoaded || !window.google) {
        reject(new Error('Google Identity Services not loaded'));
        return;
      }

      setIsLoading(true);

      // Set up the callback
      window.googleCredentialCallback = (response: GoogleCredentialResponse) => {
        try {
          const userInfo = decodeGoogleCredential(response.credential);
          setIsLoading(false);
          resolve(userInfo);
        } catch (error) {
          setIsLoading(false);
          reject(error);
        }
      };

      // Trigger the Google Sign-In prompt
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setIsLoading(false);
          reject(new Error('Google Sign-In was cancelled or not displayed'));
        }
      });
    });
  };

  const renderGoogleButton = (elementId: string) => {
    if (isGoogleLoaded && window.google) {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
        }
      );
    }
  };

  return {
    isGoogleLoaded,
    isLoading,
    signInWithGoogle,
    renderGoogleButton,
  };
};