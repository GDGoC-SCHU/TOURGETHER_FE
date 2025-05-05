import { View, Text } from "@/components/Themed";
import { Image, TouchableOpacity, Alert } from "react-native";
import EditScreenInfo from "@/components/EditScreenInfo";

import { useRouter } from "expo-router";
import { styles } from "../../styles/ViewStyle";
import { ButtonContainer } from "@/styles/Button";

import { signInWithKakao } from "./KakaoLogin";

export default function LoginScreen() {
  const router = useRouter();

  const handleKakaoLogin = async () => {
    try {
      const { token, user } = await signInWithKakao();

      console.log("Access Token:", token);
      console.log("User Info:", user);

      if (user.needPhoneVerification) {
        router.push({
          pathname: "/auth/VerifyPhone",
          params: { userId: user.id },
        });
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("Kakao login error:", error);
      Alert.alert("로그인 실패", error.message || "알 수 없는 오류입니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={{ width: 300, height: 300, marginBottom: 20 }}
        resizeMode="contain"
      />
      <Text style={styles.title}>로그인</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <ButtonContainer>
        <Image
          source={require("@/assets/images/google.png")}
          style={{ width: 300, height: 50, marginBottom: 20 }}
          resizeMode="contain"
        />
      </ButtonContainer>
      <ButtonContainer>
        <TouchableOpacity onPress={handleKakaoLogin}>
          <Image
            source={require("@/assets/images/kakao.png")}
            style={{ width: 300, height: 50, marginBottom: 20 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </ButtonContainer>
    </View>
  );
}
