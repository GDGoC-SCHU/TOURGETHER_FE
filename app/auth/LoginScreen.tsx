import {Text, View} from "@/components/Themed";
import {ActivityIndicator, Alert, Image, Platform, TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";
import {styles} from "@/styles/ViewStyle";
import {ButtonContainer} from "@/styles/Button";
import {useEffect, useState} from "react";
import {useAuth} from "@/context/authContext";
import {API_URL} from "@/app/config/api";
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { signInWithKakao } from "./KakaoLogin";
import { signInWithGoogle } from "./GoogleLogin";

/**
 * 로그인 화면 컴포넌트
 * 소셜 로그인 옵션을 제공합니다.
 */
export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {checkAuthStatus} = useAuth();
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
        "로그인 실패",
        "카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요."
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
        "로그인 실패",
        "구글 로그인 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      if (Platform.OS !== 'web') {
        setIsLoading(false);
      }
    }
  };

  return (
      <View style={styles.container}>
        <Image
            source={require("@/assets/images/logo.png")}
            style={{width: 300, height: 300, marginBottom: 20}}
            resizeMode="contain"
        />
        <Text style={styles.title}>로그인</Text>
        <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
        />
        <ButtonContainer>
          <TouchableOpacity
              onPress={handleGoogleLogin}
              disabled={isLoading}
              style={{opacity: isLoading && provider === 'google' ? 0.7 : 1}}
          >
            <Image
                source={require("@/assets/images/google.png")}
                style={{width: 300, height: 50, marginBottom: 20}}
                resizeMode="contain"
            />
          </TouchableOpacity>
        </ButtonContainer>
        <ButtonContainer>
          <TouchableOpacity
              onPress={handleKakaoLogin}
              disabled={isLoading}
              style={{opacity: isLoading && provider === 'kakao' ? 0.7 : 1}}
          >
            <Image
                source={require("@/assets/images/kakao.png")}
                style={{width: 300, height: 50, marginBottom: 20}}
                resizeMode="contain"
            />
          </TouchableOpacity>
        </ButtonContainer>

        {isLoading && (
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
              <ActivityIndicator size="small" color="#3897f0" style={{marginRight: 10}}/>
              <Text>로그인 처리 중...</Text>
            </View>
        )}
      </View>
  );
}