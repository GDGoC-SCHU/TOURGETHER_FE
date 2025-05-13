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
      Alert.alert("Please enter the verification code.");
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
      Alert.alert("Verification complete", res.data);
      router.replace("/");
    } catch (err: any) {
      Alert.alert(
        "Verificationi failed",
        err.response?.data || err.message || "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const requestSms = async () => {
    if (phone.trim().length < 11) {
      Alert.alert("Please enter a valid phone number.");
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
      Alert.alert("Send verification code", "The verification code has been sent.");
    } catch (err: any) {
      Alert.alert(" Failed to send the verification code", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.heading_container}>
          <Text style={styles.heading}>Phone number verification</Text>
          <Text style={styles.description}>
            Phone number verification is required to complete the sign-up process.
          </Text>
        </View>
        <View style={styles.input_container}>
          <View style={{ gap: 5, flex: 1 }}>
            <Text style={styles.description}>Phone Number</Text>
            <TextInput
              placeholder="Please enter your Phone Number"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.horizontal_line} />
          <View style={{alignItems:"center"}}>
          <ButtonContainer>
            <Button onPress={requestSms}>
              <ButtonText>Send Verification Code</ButtonText>
            </Button>
          </ButtonContainer>
          </View>
        </View>
      </View>
      <View style={styles.heading_container}>
        <Text style={styles.heading}>Enter Verification Code</Text>
        <Text style={styles.description}>
          Please enter the verification code sent to the phone number you provided.
        </Text>
        <View style={styles.input_container}>
          <TextInput
            placeholder="Please enter the Verification Code"
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
            <ButtonText>Verify</ButtonText>
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
