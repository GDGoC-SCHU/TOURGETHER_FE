import React from "react";
import { View } from "@/components/Themed";
import { ActivityIndicator, Alert, Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { styles } from "@/styles/ViewStyle";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithKakao } from "./KakaoLogin";
import { signInWithGoogle } from "./GoogleLogin";
import Colors from "@/constants/Colors";
import { FontAwesome5 } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';

// 구글 로고 SVG
const googleLogoSvg = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xmlns:xlink="http://www.w3.org/1999/xlink">
  <path fill="#EA4335" d="M12 4.75c1.77 0 3.36.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.61l3.99 3.09C6.22 6.86 8.87 4.75 12 4.75z"/>
  <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.86 3c2.26-2.09 3.56-5.17 3.56-8.82z"/>
  <path fill="#FBBC05" d="M5.26 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29L1.28 6.61C.47 8.24 0 10.06 0 12s.47 3.76 1.28 5.39l3.98-3.1z"/>
  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96l-3.98 3.09C3.26 21.31 7.31 24 12 24z"/>
  <path fill="none" d="M0 0h24v24H0z"/>
</svg>
`;

/**
 * 로그인 화면 컴포넌트
 * 소셜 로그인 옵션을 제공합니다.
 */
export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { checkAuthStatus } = useAuth();
  const [provider, setProvider] = useState<string | null>(null);

  // 웹 환경에서 URL 파라미터 확인 (리다이렉트 후 토큰 확인)
  useEffect(() => {
    // 웹 환경에서는 서버 인증 상태 확인으로 대체
    if (Platform.OS === 'web') {
      checkAuthStatus();
    }
  }, []);

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

        // 인증 상태 확인
        await checkAuthStatus();

        // 인증 상태 변경 후 미들웨어가 적절한 페이지로 자동 리다이렉션
        router.replace('/');
      }
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
      setIsLoading(false);
      Alert.alert(
        "Login Failed",
        "An error occurred during Kakao login. Please try again."
      );
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

        // 인증 상태 확인
        await checkAuthStatus();

        // 인증 상태 변경 후 미들웨어가 적절한 페이지로 자동 리다이렉션
        router.replace('/');
      }
    } catch (error) {
      console.error("구글 로그인 오류:", error);
      setIsLoading(false);
      Alert.alert(
        "Login Failed",
        "An error occurred during Google login. Please try again."
      );
    } finally {
      if (Platform.OS !== 'web') {
        setIsLoading(false);
      }
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/jeju.png")}
      style={loginStyles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={loginStyles.overlay}
      >
        <View style={loginStyles.container}>
          <View style={loginStyles.logoContainer}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={loginStyles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={loginStyles.title}>TOURGETHER</Text>
          <Text style={loginStyles.subtitle}>Discover the world together</Text>

          <View style={loginStyles.buttonContainer}>
            {/* 구글 로그인 버튼 - 카카오 버튼과 비슷한 스타일로 수정 */}
            <TouchableOpacity
              onPress={handleGoogleLogin}
              disabled={isLoading}
              style={[
                loginStyles.googleButton,
                isLoading && provider === 'google' ? loginStyles.buttonDisabled : null
              ]}
              activeOpacity={0.8}
            >
              <View style={loginStyles.googleButtonContentWrapper}>
                <View style={loginStyles.googleLogoContainer}>
                  <SvgXml xml={googleLogoSvg} width={24} height={24} />
                </View>
                <Text style={loginStyles.googleButtonText}>Sign in with Google</Text>
              </View>
            </TouchableOpacity>

            {/* 카카오 로그인 버튼 - 제공된 이미지 스타일 적용 */}
            <TouchableOpacity
              onPress={handleKakaoLogin}
              disabled={isLoading}
              style={[
                loginStyles.kakaoButton,
                isLoading && provider === 'kakao' ? loginStyles.buttonDisabled : null
              ]}
              activeOpacity={0.8}
            >
              <View style={loginStyles.kakaoButtonContentWrapper}>
                <Image
                  source={require("../../assets/images/kakao_login_large_wide.png")}
                  style={loginStyles.kakaoIconImage}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </View>

          {isLoading && (
            <View style={loginStyles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" style={loginStyles.spinner} />
              <Text style={loginStyles.loadingText}>Logging in...</Text>
            </View>
          )}

          <View style={loginStyles.footer}>
            <FontAwesome5 name="compass" size={20} color="#fff" />
            <Text style={loginStyles.footerText}>Your journey begins here</Text>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const loginStyles = StyleSheet.create({
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
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 40,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  // 구글 버튼 스타일 - 카카오 버튼과 비슷하게 조정
  googleButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#dadce0',
  },
  googleButtonContentWrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  googleLogoContainer: {
    marginRight: 24,
    width: 24,
    height: 24,
  },
  googleButtonText: {
    color: '#3c4043',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  // 카카오 버튼 스타일 - 구글 버튼과 균형 맞춤
  kakaoButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#FEE500',
    borderRadius: 4,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  kakaoButtonContentWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  kakaoIconImage: {
    width: '100%',
    height: '100%'
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  spinner: {
    marginRight: 10,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  }
});