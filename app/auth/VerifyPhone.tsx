import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {useRouter} from 'expo-router';
import {AuthProvider, useAuth} from '@/context/authContext';
import {usePhoneAuth} from '@/app/hooks/usePhoneAuth';

// 실제 전화번호 인증 컴포넌트
function PhoneVerificationContent() {
  const {needPhoneVerification} = useAuth();
  const router = useRouter();
  const {
    phone,
    setPhone,
    code,
    setCode,
    isLoading,
    isCodeSent,
    message,
    sendVerificationCode,
    verifyCode
  } = usePhoneAuth();

  // 전화번호 인증 완료 후 처리
  const handleVerifyComplete = async () => {
    const success = await verifyCode();
    if (success) {
      // 성공 메시지 표시 후 홈 화면으로 이동
      Alert.alert(
          "인증 완료",
          "전화번호 인증이 성공적으로 완료되었습니다.",
          [
            {
              text: "확인",
              onPress: () => router.replace("/")
            }
          ]
      );
    }
  };

  // 이미 인증된 경우 홈 화면으로 리다이렉트
  if (!needPhoneVerification) {
    router.replace('/');
    return null;
  }

  return (
      <View style={styles.container}>
        <Text style={styles.title}>전화번호 인증</Text>

        <Text style={styles.subtitle}>
          안전한 서비스 이용을 위해 전화번호 인증이 필요합니다.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
              style={styles.input}
              placeholder="전화번호 (-없이 입력)"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              editable={!isCodeSent || isLoading}
          />

          <TouchableOpacity
              style={[
                styles.button,
                (isCodeSent && !isLoading) && styles.buttonDisabled
              ]}
              onPress={sendVerificationCode}
              disabled={isCodeSent && !isLoading}
          >
            <Text style={styles.buttonText}>
              {isCodeSent ? "재전송" : "인증번호 받기"}
            </Text>
          </TouchableOpacity>
        </View>

        {isCodeSent && (
            <View style={styles.verificationContainer}>
              <TextInput
                  style={styles.input}
                  placeholder="인증번호 입력"
                  keyboardType="number-pad"
                  value={code}
                  onChangeText={setCode}
                  editable={!isLoading}
              />

              <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleVerifyComplete}
                  disabled={isLoading || !code}
              >
                <Text style={styles.buttonText}>확인</Text>
              </TouchableOpacity>
            </View>
        )}

        {message ? (
            <Text style={[
              styles.message,
              message.includes('실패') || message.includes('오류')
                  ? styles.errorMessage
                  : styles.successMessage
            ]}>
              {message}
            </Text>
        ) : null}

        {isLoading && (
            <ActivityIndicator size="large" color="#3897f0" style={styles.loader}/>
        )}

        {/* 웹 환경에서만 보이는 reCAPTCHA 컨테이너 */}
        {Platform.OS === 'web' && (
            <View nativeID="recaptcha-container" style={styles.recaptchaContainer}/>
        )}
      </View>
  );
}

// 메인 컴포넌트 - AuthProvider로 감싸서 내보내기
export default function VerifyPhoneScreen() {
  return (
      <AuthProvider>
        <PhoneVerificationContent/>
      </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
    maxWidth: 300,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    maxWidth: 400,
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3897f0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#b2dffc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
  },
  successMessage: {
    color: 'green',
  },
  loader: {
    marginTop: 20,
  },
  recaptchaContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 1,
    width: 1,
    opacity: 0.01,
  }
});