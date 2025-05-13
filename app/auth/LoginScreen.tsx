import { Image, TouchableOpacity, Alert, View, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter, useLocalSearchParams } from "expo-router";
import { styles } from "../../styles/ViewStyle";
import { ButtonContainer } from "@/styles/Button";
import { signInWithKakao } from "./KakaoLogin";
import axios from "axios";
import { useState, useEffect } from "react";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const REDIRECT_URL = process.env.EXPO_PUBLIC_REDIRECT_URL;

export default function LoginScreen() {
  const router = useRouter();
  const { token,mode } = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleKakaoLogin = async () => {
    try {
      const { token, user } = await signInWithKakao();

      console.log("Access Token:", token);
      console.log("User Info:", user);

      if (mode === "signup") {
        if (user.needPhoneVerification) {
          router.push({ pathname: "/auth/VerifyPhone", params: { userId: user.id } });
        } else {
          router.push("/auth/Register");
        }
      } else {
        router.push("/pages/Home");
      }
    } catch (error: any) {
      console.error("Kakao login error:", error);
      Alert.alert("로그인 실패", error.message || "알 수 없는 오류입니다.");
    }
  };

  const handleGoogleLogin = () => {
    const redirectUrl = `${BACKEND_URL}/oauth2/authorization/google?mode=${mode}`;
    window.location.assign(redirectUrl);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    if (token) {
      SecureStore.setItemAsync("accessToken", token).then(() => {
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
      console.log(token);
      if (mode === "signup") {
        router.replace("/auth/Register");
      } else {
        router.replace("/pages/Home");
      }
    });
  }

  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={{ width: 300, height: 300, marginBottom: 20 }}
        resizeMode="contain"
      />
      <Text style={styles.title}>Login</Text>
      <View style={styles.separator} />

      <ButtonContainer>
        <TouchableOpacity onPress={handleGoogleLogin}>
          <Image
            source={require("@/assets/images/google.png")}
            style={{ width: 300, height: 50, marginBottom: 20 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
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
