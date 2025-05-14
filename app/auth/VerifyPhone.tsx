import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal
} from 'react-native';
import {useRouter} from 'expo-router';
import {useAuth} from '@/context/authContext';
import {usePhoneAuth} from '@/app/hooks/usePhoneAuth';
import {PHONE_VERIFICATION_ERRORS} from '@/app/utils/errorMessages';

// 전화번호 인증 컴포넌트
export default function VerifyPhoneScreen() {
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
    verifyCode,
    resendVerificationCode
  } = usePhoneAuth();

  // 전화번호 인증 완료 후 처리
  const handleVerifyComplete = async () => {
    const success = await verifyCode();
    if (success) {
      // 성공 메시지 표시
      Alert.alert(
          "인증 완료",
          "전화번호 인증이 성공적으로 완료되었습니다.",
          [
            {
              text: "확인",
              onPress: () => {
                console.log("인증 완료 알림 확인 버튼 클릭");
                // 직접 탭 홈으로 이동
                if (Platform.OS === 'web' && typeof window !== 'undefined') {
                  console.log("웹 환경에서 직접 URL 변경");
                  window.location.href = '/(tabs)';
                } else {
                  console.log("모바일 환경에서 router.replace 호출");
                  router.replace('/(tabs)');
                }
              }
            }
          ]
      );
    }
  };

  // 인증 코드 재전송 처리
  const handleResendCode = async () => {
    await resendVerificationCode();
  };

  // 이미 인증된 경우 미들웨어가 자동으로 리다이렉트 처리

  // 로딩 메시지 결정
  const getLoadingMessage = () => {
    if (!isLoading) return "";
    
    if (!isCodeSent) {
      return PHONE_VERIFICATION_ERRORS.SUCCESS.SENDING;
    } else {
      return PHONE_VERIFICATION_ERRORS.SUCCESS.VERIFYING;
    }
  };

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
              editable={!isLoading}
          />

          <TouchableOpacity
              style={[
                styles.button,
                isLoading && styles.buttonDisabled
              ]}
              onPress={isCodeSent ? handleResendCode : sendVerificationCode}
              disabled={isLoading}
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

        {/* 웹 환경에서만 보이는 reCAPTCHA 컨테이너 */}
        {Platform.OS === 'web' && (
            <View nativeID="recaptcha-container" style={styles.recaptchaContainer}/>
        )}

        {/* 로딩 모달 */}
        <Modal
            transparent={true}
            visible={isLoading}
            animationType="fade"
        >
            <View style={styles.modalBackground}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3897f0" />
                    <Text style={styles.loadingText}>{getLoadingMessage()}</Text>
                </View>
            </View>
        </Modal>
      </View>
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
  },
  // 로딩 모달 스타일
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 250,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  }
});