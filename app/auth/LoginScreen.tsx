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

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {checkAuthStatus} = useAuth();

  // 웹 환경에서 URL 파라미터 확인 (리다이렉트 후 토큰 확인)
  useEffect(() => {
    // 웹 환경에서는 서버 인증 상태 확인으로 대체
    if (Platform.OS === 'web') {
      checkAuthStatus();
    }
  }, []);

  // 소셜 로그인 시작 함수
  const startSocialLogin = async (provider: 'google' | 'kakao' | 'naver') => {
    if (isLoading) return;

    setIsLoading(true);
    console.log(`${provider} 로그인 시작`);

    try {
      if (Platform.OS === 'web') {
        // 웹 환경에서 직접 리다이렉트 (쿠키 기반 인증)
        if (typeof window !== 'undefined') {
          window.location.href = `${API_URL}/oauth2/authorization/${provider}?web=true`;
        }
      } else {
        // 모바일 환경에서 웹브라우저로 인증 페이지 열기
        const redirectUrl = Linking.createURL('/auth/socialCallBack');
        const authUrl = `${API_URL}/oauth2/authorization/${provider}`;
        
        // WebBrowser로 인증 페이지 열기
        const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
        
        if (result.type === 'success') {
          // 인증 성공 시 상태 확인
          await checkAuthStatus();
          
          // 인증 상태 변경 후 미들웨어가 적절한 페이지로 자동 리다이렉션
          router.replace('/');
        } else {
        setIsLoading(false);
        }
      }
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error);
      setIsLoading(false);
      Alert.alert(
          "로그인 실패",
          "로그인 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  const handleKakaoLogin = () => startSocialLogin('kakao');
  const handleGoogleLogin = () => startSocialLogin('google');

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
              style={{opacity: isLoading ? 0.7 : 1}}
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
              style={{opacity: isLoading ? 0.7 : 1}}
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