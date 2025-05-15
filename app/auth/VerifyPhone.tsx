import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet
} from 'react-native';
import {useRouter} from 'expo-router';
import {useAuth} from '@/context/authContext';
import {usePhoneAuth} from '@/app/hooks/usePhoneAuth';
import {PHONE_VERIFICATION_ERRORS} from '@/app/utils/errorMessages';

/**
 * 전화번호 인증 화면 컴포넌트
 * 사용자의 전화번호를 인증하는 기능을 제공합니다.
 */
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

  /**
   * 전화번호 형식화 (예: 010-1234-5678)
   */
  const formatPhoneNumber = (number: string): string => {
    if (!number) return '';
    
    // 숫자만 추출
    const digits = number.replace(/\D/g, '');
    
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 7) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
  };

  /**
   * 전화번호 인증 완료 후 처리
   */
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

  /**
   * 인증 코드 재전송 처리
   */
  const handleResendCode = async () => {
    await resendVerificationCode();
  };

  /**
   * 로딩 메시지 결정
   */
  const getLoadingMessage = () => {
    if (!isLoading) return "";
    
    if (!isCodeSent) {
      return PHONE_VERIFICATION_ERRORS.SUCCESS.SENDING;
    } else {
      return PHONE_VERIFICATION_ERRORS.SUCCESS.VERIFYING;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
              <Text style={styles.title}>전화번호 인증</Text>
              <Text style={styles.subtitle}>
                안전한 서비스 이용을 위해 전화번호 인증이 필요합니다.
              </Text>
            </View>

            {/* 메시지 표시 */}
            {message ? (
              <View style={styles.messageContainer}>
                <Text style={[
                  styles.message,
                  message.includes('실패') || message.includes('오류')
                    ? styles.errorMessage
                    : styles.successMessage
                ]}>
                  {message}
                </Text>
              </View>
            ) : null}

            {/* 전화번호 입력 또는 인증코드 입력 */}
            {!isCodeSent ? (
              <View style={styles.formContainer}>
                <Text style={styles.label}>전화번호</Text>
                <TextInput
                  style={styles.input}
                  placeholder="01012345678"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(text) => {
                    const formatted = formatPhoneNumber(text);
                    setPhone(formatted);
                  }}
                  editable={!isLoading}
                />
                
                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={sendVerificationCode}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    인증번호 받기
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.formContainer}>
                <Text style={styles.label}>인증 코드</Text>
                <TextInput
                  style={styles.input}
                  placeholder="인증 코드 입력"
                  keyboardType="number-pad"
                  value={code}
                  onChangeText={setCode}
                  editable={!isLoading}
                  maxLength={6}
                />
                
                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleVerifyComplete}
                  disabled={isLoading || !code}
                >
                  <Text style={styles.buttonText}>확인</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleResendCode}
                  disabled={isLoading}
                >
                  <Text style={styles.secondaryButtonText}>인증번호 재전송</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 로딩 모달 */}
      <Modal
        transparent={true}
        visible={isLoading}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#4285F4" />
            <Text style={styles.modalText}>{getLoadingMessage()}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: 500,
    marginHorizontal: 'auto',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  message: {
    padding: 12,
    borderRadius: 4,
    fontSize: 14,
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
    color: '#d32f2f',
  },
  successMessage: {
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
    color: '#2e7d32',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4285F4', // Google 블루
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#4285F4',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
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
    minWidth: 250
  },
  modalText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    textAlign: 'center'
  }
});