import {Text, View} from "@/components/Themed";
import {ActivityIndicator, Alert, Image, Platform, TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";
import {styles} from "@/styles/ViewStyle";
import {ButtonContainer} from "@/styles/Button";
import {useEffect, useState} from "react";
import {useAuth} from "@/context/authContext";
import {handleKakaoLoginCallback, signInWithKakao} from "./KakaoLogin";

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {login} = useAuth();

  // 웹 환경에서 URL 파라미터 확인 (리다이렉트 후 토큰 확인)
  useEffect(() => {
    if (Platform.OS === 'web') {
      const loginData = handleKakaoLoginCallback();
      if (loginData) {
        handleLoginSuccess(loginData.token, loginData.refreshToken, loginData.user);
      }
    }
  }, []);

  // 로그인 성공 처리
  const handleLoginSuccess = async (token: string, refreshToken: string | undefined, user: any) => {
    console.log("로그인 성공:", token, refreshToken, user);

    try {
      // 인증 컨텍스트를 통해 로그인 처리
      await login({
        accessToken: token,
        refreshToken,
        userId: user.id.toString(),
        needPhoneVerification: user.needPhoneVerification
      });

      // 전화번호 인증이 필요한 경우
      if (user.needPhoneVerification) {
        router.replace("/auth/VerifyPhone");
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.error("로그인 후처리 오류:", error);
      Alert.alert("오류", "로그인 정보 저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    console.log("카카오 로그인 시작");

    try {
      const {token, refreshToken, user} = await signInWithKakao();
      handleLoginSuccess(token, refreshToken, user);
    } catch (error: any) {
      console.error("카카오 로그인 오류:", error);
      setIsLoading(false);
      Alert.alert(
          "로그인 실패",
          error.message || "로그인 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    console.log("구글 로그인 시작");

    try {
      // 구글 로그인 엔드포인트로 리다이렉트
      if (Platform.OS === 'web') {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google?web=true';
      } else {
        // 모바일 구현
        Alert.alert("알림", "모바일 환경에서는 아직 구글 로그인이 지원되지 않습니다.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("구글 로그인 오류:", error);
      setIsLoading(false);
      Alert.alert(
          "로그인 실패",
          "로그인 중 오류가 발생했습니다. 다시 시도해주세요."
      );
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