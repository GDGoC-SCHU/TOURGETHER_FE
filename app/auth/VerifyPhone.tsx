// app/auth/verify-phone.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function VerifyPhone() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/auth/phone/verify?userId=${userId}&code=${code}`
      );
      Alert.alert("인증 완료", res.data);
      router.push("/");
    } catch (err: any) {
      Alert.alert("인증 실패", err.response?.data || err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>전화번호 인증</Text>
      <Text style={styles.subtitle}>인증 코드를 입력하세요</Text>

      <TextInput
        style={styles.input}
        placeholder="인증 코드"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>인증하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  subtitle: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 16,
    borderRadius: 4,
  },
  button: {
    backgroundColor: "#0066FF",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
});
