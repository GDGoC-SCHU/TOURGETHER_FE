import React from "react";
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";
import { LinearGradient } from 'expo-linear-gradient';
import Colors from "@/constants/Colors";
import { signInWithKakao } from "./auth/KakaoLogin";
import { signInWithGoogle } from "./auth/GoogleLogin";
import { FontAwesome } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';

// 구글 로고 SVG
const googleLogoSvg = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
  <path fill="none" d="M0 0h48v48H0z"></path>
</svg>
`;

/**
 * App Welcome Screen Component
 * Provides login/signup buttons and welcomes users to the app.
 */
export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [provider, setProvider] = React.useState<string | null>(null);

  // 카카오 로그인 처리
  const handleKakaoLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setProvider('kakao');
    console.log("카카오 로그인 시작");

    try {
      if (Platform.OS === 'web') {
        // 웹 환경에서는 직접 리다이렉트
        await signInWithKakao();
      } else {
        // 모바일 환경에서는 signInWithKakao 함수 사용
        const result = await signInWithKakao();
        console.log("카카오 로그인 결과:", result);
        router.replace('/');
      }
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
      setIsLoading(false);
    } finally {
      if (Platform.OS !== 'web') {
        setIsLoading(false);
      }
    }
  };

  // 구글 로그인 처리
  const handleGoogleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setProvider('google');
    console.log("구글 로그인 시작");

    try {
      if (Platform.OS === 'web') {
        // 웹 환경에서는 직접 리다이렉트
        await signInWithGoogle();
      } else {
        // 모바일 환경에서는 signInWithGoogle 함수 사용
        const result = await signInWithGoogle();
        console.log("구글 로그인 결과:", result);
        router.replace('/');
      }
    } catch (error) {
      console.error("구글 로그인 오류:", error);
      setIsLoading(false);
    } finally {
      if (Platform.OS !== 'web') {
        setIsLoading(false);
      }
    }
  };

  // Authenticated users are redirected by middleware, so we only show UI for non-authenticated users
  return (
    <ImageBackground
      source={require("@/assets/images/jeju.png")}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.title}>TOURGETHER</Text>
          <Text style={styles.subtitle}>Discover the world together</Text>
          
          <View style={styles.buttonContainer}>
            {/* 구글 로그인 버튼 */}
            <TouchableOpacity
              onPress={handleGoogleLogin}
              disabled={isLoading}
              style={[
                styles.googleButton,
                isLoading && provider === 'google' ? styles.buttonDisabled : null
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.googleIconContainer}>
                <SvgXml xml={googleLogoSvg} width={24} height={24} />
              </View>
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            {/* 카카오 로그인 버튼 */}
            <TouchableOpacity
              onPress={handleKakaoLogin}
              disabled={isLoading}
              style={[
                styles.kakaoButton,
                isLoading && provider === 'kakao' ? styles.buttonDisabled : null
              ]}
              activeOpacity={0.8}
            >
              <FontAwesome name="comment" size={20} color="#3A1D1D" style={styles.kakaoIcon} />
              <Text style={styles.kakaoButtonText}>Login with Kakao</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Your journey is just a tap away
            </Text>
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
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 70,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  // 구글 버튼 스타일
  googleButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#3c4043',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
    marginRight: 24,
  },
  // 카카오 버튼 스타일
  kakaoButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FEE500',
    borderRadius: 25,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  kakaoIcon: {
    marginRight: 12,
  },
  kakaoButtonText: {
    color: '#3A1D1D',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
    marginRight: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  footer: {
    marginTop: 40,
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
});