import React, {useEffect, useState, useRef} from 'react';
import {ActivityIndicator, Platform, StyleSheet, Text, View, Image, ImageBackground} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {useAuth} from '@/context/authContext';
import { handleKakaoLoginCallback } from './KakaoLogin';
import { handleGoogleLoginCallback } from './GoogleLogin';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';

/**
 * Social Login Callback Handler Component
 * Handles redirects after Kakao and Google login.
 */
export default function SocialCallback() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState<string>("Processing login information...");
  const router = useRouter();
  const {checkAuthStatus, isAuthenticated, needPhoneVerification, user} = useAuth();
  const params = useLocalSearchParams<{
    userId?: string;
    needPhoneVerification?: string;
    provider?: string;
  }>();
  const isMounted = useRef(true);
  const navigationTimeout = useRef<NodeJS.Timeout | null>(null);

  // Safe navigation function
  const safeNavigate = (path: any, delay: number = 300) => {
    // Cancel previous timer if exists
    if (navigationTimeout.current) {
      clearTimeout(navigationTimeout.current);
    }
    
    // Set new timer
    navigationTimeout.current = setTimeout(() => {
      if (isMounted.current) {
        try {
          router.replace(path);
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    }, delay);
  };

  useEffect(() => {
    // Set component mount state
    isMounted.current = true;
    
    // Timer for changing loading text
    const textTimer1 = setTimeout(() => {
      if (isMounted.current) {
        setLoadingText("Verifying user information...");
      }
    }, 1000);
    
    const textTimer2 = setTimeout(() => {
      if (isMounted.current) {
        setLoadingText("Authentication complete. Redirecting...");
      }
    }, 2000);
    
    async function handleCallback() {
      console.log('SocialCallback component loaded');
      console.log('URL parameters:', params);

      if (Platform.OS !== 'web') {
        console.log('Mobile environment detected, navigating to home');
        safeNavigate('/');
        return;
      }

      try {
        // Check parameters directly from URL (in case useLocalSearchParams doesn't work)
        const urlParams = new URLSearchParams(window.location.search);
        const urlUserId = urlParams.get('userId');
        const urlNeedPhoneVerification = urlParams.get('needPhoneVerification');
        const urlAccessToken = urlParams.get('accessToken');
        
        console.log('Direct URL parameter check:', { 
          userId: urlUserId, 
          needPhoneVerification: urlNeedPhoneVerification,
          accessToken: urlAccessToken ? 'exists' : 'not found'
        });

        // Process parameters directly from URL if available
        if (urlUserId && urlAccessToken) {
          console.log('Processing redirect with URL parameters');
          
          // Remove parameters from URL (keep URL clean)
          if (typeof window !== 'undefined') {
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
          
          // Check if phone verification is needed
          if (urlNeedPhoneVerification === 'true') {
            safeNavigate('/auth/Register');
          } else {
            safeNavigate('/(tabs)');
          }
          return;
        }

        // Try to process social login callback
        const kakaoResult = handleKakaoLoginCallback();
        const googleResult = handleGoogleLoginCallback();
        const loginResult = kakaoResult || googleResult;

        // If login info was retrieved from callback
        if (loginResult) {
          console.log('Social login callback processed:', loginResult);
          
          // Check if phone verification is needed
          if (loginResult.user.needPhoneVerification) {
            safeNavigate('/auth/Register');
          } else {
            safeNavigate('/(tabs)');
          }
          return;
        }
        
        // Request authentication status from server (cookie-based)
        console.log('Requesting authentication status from server');
        const authStatus = await checkAuthStatus();
        
        console.log('Authentication status check complete:', { 
          isAuthenticated, 
          needPhoneVerification,
          authStatus
        });
        
        // Remove query parameters from URL (security)
        // Conditional handling for SSR environment where window object may not exist
        if (typeof window !== 'undefined' && window.location) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
        
        // Navigate to appropriate screen based on authentication status
        if (isAuthenticated) {
          console.log('Authenticated, processing redirect');
          if (needPhoneVerification) {
            safeNavigate('/auth/Register');
          } else {
            safeNavigate('/(tabs)');
          }
        } else {
          // Check URL parameters (added by OAuth2SuccessHandler)
          if (params.userId) {
            console.log('userId found in params:', params.userId);
            // Check if phone verification is needed
            if (params.needPhoneVerification === 'true') {
              safeNavigate('/auth/Register');
            } else {
              safeNavigate('/(tabs)');
            }
          } else {
            // Redirect to login page on authentication failure
            console.log('Authentication failed, redirecting to login page');
            setError('로그인에 실패했습니다. 다시 시도해주세요.');
            safeNavigate('/auth/LoginScreen', 2000);
          }
        }
      } catch (err) {
        console.error('Social login callback processing error:', err);
        setError('An error occurred while processing your authentication.');
        safeNavigate('/auth/LoginScreen', 2000);
      } finally {
        setLoading(false);
      }
    }

    // Start callback processing with slight delay
    setTimeout(() => {
      if (isMounted.current) {
        handleCallback();
      }
    }, 100);

    // Cleanup on component unmount
    return () => {
      isMounted.current = false;
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
      clearTimeout(textTimer1);
      clearTimeout(textTimer2);
    };
  }, []);

  if (loading) {
    return (
      <ImageBackground
        source={require('@/assets/images/busan.png')}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
          style={styles.overlay}
        >
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <FontAwesome5 name="compass" size={60} color="#fff" />
            </View>
            
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>{loadingText}</Text>
              
              {user && (
                <Text style={styles.welcomeText}>
                  Welcome, {user.displayName || 'traveler'}!
                </Text>
              )}
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground
        source={require('@/assets/images/busan.png')}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
          style={styles.overlay}
        >
          <View style={styles.container}>
            <View style={styles.errorContainer}>
              <FontAwesome5 name="exclamation-circle" size={60} color="#fff" style={styles.errorIcon} />
              <Text style={styles.errorTitle}>Authentication Error</Text>
              <Text style={styles.errorMessage}>{error}</Text>
              <Text style={styles.suggestion}>Please try logging in again.</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('@/assets/images/busan.png')}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <FontAwesome5 name="compass" size={60} color="#fff" />
          </View>
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Authentication complete. Redirecting...</Text>
            
            {user && (
              <Text style={styles.welcomeText}>
                Welcome, {user.displayName || 'traveler'}!
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  welcomeText: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
  },
  errorIcon: {
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  suggestion: {
    fontSize: 16,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});