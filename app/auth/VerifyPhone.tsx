import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, StyleSheet, View, Text, TextInput } from "react-native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ButtonContainer, Button, ButtonText } from "@/styles/Button";

export default function VerifyPhone() {
  const [input, setInput] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
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

  const ButtonChange = (text: string) => {
    setInput(text);
    if (text.length < 11) {
      setIsFocused(false);
    } else if (text.length === 11) {
      setIsFocused(true);
    }
    console.log(text);
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
            <Button onPress={() => ButtonChange(input)}>
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
          <Button onPress={handleVerify}>
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
