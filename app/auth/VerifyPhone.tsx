import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, StyleSheet, View, Text, TextInput } from "react-native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ButtonContainer, Button, ButtonText } from "@/styles/Button";

export default function VerifyPhone() {
  const [phone, setPhone] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [code, setCode] = useState("");
  const router = useRouter();

  const verifyCode = async () => {
    if (code.trim().length === 0) {
      Alert.alert("인증번호를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/phone/verify",
        null,
        {
          params: { userId, code },
        }
      );
      Alert.alert("인증 완료", res.data);
      router.replace("/");
    } catch (err: any) {
      Alert.alert(
        "인증 실패",
        err.response?.data || err.message || "오류 발생"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const requestSms = async () => {
    if (phone.trim().length < 11) {
      Alert.alert("정확한 전화번호를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    setPhone(phone.replace(/[^0-9]/g, "")); // 숫자만 남김
    try {
      await axios.post(
        `http://localhost:8080/api/auth/phone/send?phone=${phone}`,
        null,
        { params: { userId: userId } }
      );
      Alert.alert("인증번호 전송", "인증번호가 전송되었습니다.");
    } catch (err: any) {
      Alert.alert("인증번호 전송 실패", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.heading_container}>
          <Text style={styles.heading}>전화번호 인증</Text>
          <Text style={styles.description}>
            회원가입을 완료하기 위해 전화번호 인증이 필요합니다.
          </Text>
        </View>
        <View style={styles.input_container}>
          <View style={{ gap: 5, flex: 1 }}>
            <Text style={styles.description}>전화번호</Text>
            <TextInput
              placeholder="전화번호를 입력하세요"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.horizontal_line} />
          <ButtonContainer>
            <Button onPress={requestSms}>
              <ButtonText>인증번호 전송</ButtonText>
            </Button>
          </ButtonContainer>
        </View>
      </View>
      <View style={styles.heading_container}>
        <Text style={styles.heading}>인증번호 입력</Text>
        <Text style={styles.description}>
          입력한 전화번호로 전송된 인증번호를 입력해주세요.
        </Text>
        <View style={styles.input_container}>
          <TextInput
            placeholder="인증번호를 입력하세요"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
          />
          <View style={styles.horizontal_line} />
        </View>
      </View>
      <View style={styles.footer}>
        <ButtonContainer>
          <Button onPress={verifyCode}>
            <ButtonText>인증하기</ButtonText>
          </Button>
        </ButtonContainer>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 70,
    paddingHorizontal: 20,
  },
  header: {
    gap: 10,
  },
  footer: {},
  heading_container: {
    gap: 20,
  },
  heading: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  input_container: {},
  description: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    color: "black",
  },
  horizontal_line: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
});
