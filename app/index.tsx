import React from "react";
import { Image, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";
import { Button, ButtonContainer, ButtonText } from "@/styles/Button";
import { styles } from "@/styles/ViewStyle";

/**
 * 앱 시작 화면 컴포넌트
 * 로그인/회원가입 버튼을 제공합니다.
 */
export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // 로그인 화면으로 이동
  const handleLoginPress = () => {
    router.push("/auth/LoginScreen");
  };

  // 회원가입 화면으로 이동
  const handleSignUpPress = () => {
    router.push({ 
      pathname: "/auth/LoginScreen", 
      params: { mode: "signup" } 
    });
  };

  // 인증된 사용자는 미들웨어에서 리다이렉트되므로 여기서는 비인증 사용자용 UI만 표시
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={{ width: 300, height: 300, marginBottom: 20 }}
        resizeMode="contain"
      />
      <Text style={styles.title}>Tourgether</Text>
      <Text style={[styles.title, { marginBottom: 30 }]}>함께하는 즐거움</Text>
      
      <ButtonContainer>
        <Button onPress={handleSignUpPress}>
          <ButtonText>회원가입</ButtonText>
        </Button>
      </ButtonContainer>
      
      <ButtonContainer>
        <Button onPress={handleLoginPress}>
          <ButtonText>로그인</ButtonText>
        </Button>
      </ButtonContainer>
    </View>
  );
}