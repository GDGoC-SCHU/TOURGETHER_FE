import { View, Text } from "@/components/Themed";
import { Image, TouchableOpacity } from "react-native";
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
    } catch (error) {
      console.error("Kakao login error:", error);
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
