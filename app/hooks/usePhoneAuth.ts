import {useState} from 'react';
import {Platform} from 'react-native';
import {useAuth} from '@/context/authContext';
import axios from 'axios';
import {API_URL} from '@/app/config/api';
import {useRouter} from 'expo-router';
import {PHONE_VERIFICATION_ERRORS, getPhoneVerificationErrorMessage} from '@/app/utils/errorMessages';

// 전화번호 형식 포맷팅
const formatPhoneNumber = (input: string): string => {
  const numbers = input.replace(/[^0-9]/g, "");
  if (numbers.startsWith("0")) {
    return "+82" + numbers.substring(1);
  }

  if (numbers.startsWith("+")) {
    return numbers;
  }

  return "+82" + numbers;
};

export function usePhoneAuth() {
  const [phone, setPhone] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const {userId, getAuthHeader, checkAuthStatus} = useAuth();
  const router = useRouter();

  // 인증 코드 발송 - 백엔드 API 사용
  const sendVerificationCode = async () => {
    if (!phone) {
      setMessage(PHONE_VERIFICATION_ERRORS.SEND.EMPTY_PHONE);
      return;
    }

    setIsLoading(true);
    setMessage(PHONE_VERIFICATION_ERRORS.SUCCESS.SENDING);

    try {
      const formattedPhone = formatPhoneNumber(phone);
      console.log(`인증 코드 발송 중: ${formattedPhone}`);

      // 백엔드 API를 통한 인증 코드 발송
      const authHeader = await getAuthHeader();
      const response = await axios.post(
        `${API_URL}/api/phone/sendVerification`,
        {phoneNumber: formattedPhone},
        authHeader
      );

      if (response.data.success) {
        setIsCodeSent(true);
        setMessage(PHONE_VERIFICATION_ERRORS.SUCCESS.CODE_SENT);
      } else {
        throw new Error(response.data.message || PHONE_VERIFICATION_ERRORS.SEND.DEFAULT);
      }
    } catch (error: any) {
      console.error("인증 코드 발송 오류:", error);
      
      // 오류 메시지 처리
      let userFriendlyMessage = getPhoneVerificationErrorMessage('SEND', error.message);
      
      // 네트워크 오류 처리
      if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('network'))) {
        userFriendlyMessage = "네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인하고 다시 시도해주세요.";
      }
      
      setMessage(userFriendlyMessage);
      setIsCodeSent(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 인증 코드 확인
  const verifyCode = async () => {
    if (!code) {
      setMessage(PHONE_VERIFICATION_ERRORS.VERIFY.EMPTY_CODE);
      return false;
    }

    setIsLoading(true);
    setMessage(PHONE_VERIFICATION_ERRORS.SUCCESS.VERIFYING);

    try {
      // 백엔드 API를 통한 인증 코드 확인
      const authHeader = await getAuthHeader();
      const response = await axios.post(
        `${API_URL}/api/phone/verifyCode`,
        {
          phoneNumber: formatPhoneNumber(phone),
          code: code
        },
        authHeader
      );

      if (!response.data.success) {
        throw new Error(response.data.message || PHONE_VERIFICATION_ERRORS.VERIFY.DEFAULT);
      }
      
      // 인증 코드 확인 성공 후 사용자 상태 업데이트
      console.log("인증 코드 확인 성공, 사용자 상태 업데이트 시작");
      await updatePhoneVerificationStatus();
      
      // 인증 상태 갱신
      await checkAuthStatus();
      
      setMessage(PHONE_VERIFICATION_ERRORS.SUCCESS.VERIFIED);
      
      // 직접 탭 홈으로 이동
      console.log("탭 홈으로 직접 이동 시도");
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        setTimeout(() => {
          console.log("웹 환경에서 직접 URL 변경");
          window.location.href = '/(tabs)';
        }, 500);
      } else {
        setTimeout(() => {
          console.log("모바일 환경에서 router.replace 호출");
          router.replace('/(tabs)');
        }, 500);
      }
      
      return true;
    } catch (error: any) {
      console.error("인증 코드 확인 오류:", error);
      
      // 오류 메시지를 사용자 친화적으로 변환
      const userFriendlyMessage = getPhoneVerificationErrorMessage('VERIFY', error.message);
      setMessage(userFriendlyMessage);
      
      // 특정 오류의 경우 코드 입력란 초기화
      if (error.message.toLowerCase().includes('invalid code') || 
          error.message.toLowerCase().includes('code is incorrect') ||
          error.message.toLowerCase().includes('expired')) {
        setCode("");
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 인증 코드 재전송 함수
  const resendVerificationCode = async () => {
    // 기존 코드 초기화
    setCode("");
    // 코드 전송 상태 초기화
    setIsCodeSent(false);
    
    // 인증 코드 발송 함수 호출
    await sendVerificationCode();
  };

  // 백엔드에 전화번호 인증 상태 업데이트
  const updatePhoneVerificationStatus = async () => {
    try {
      if (!userId) {
        console.error("사용자 ID가 없습니다. 현재 userId:", userId);
        throw new Error(PHONE_VERIFICATION_ERRORS.UPDATE.NO_USER_ID);
      }

      console.log("전화번호 인증 상태 업데이트 시도 - userId:", userId);
      
      // 웹 환경에서는 withCredentials 옵션을 사용하여 쿠키 전송
      if (Platform.OS === 'web') {
        const response = await axios.post(
            `${API_URL}/api/users/${userId}/verifyPhone`,
            {phoneNumber: formatPhoneNumber(phone)},
            { withCredentials: true }
        );
        
        if (!response.data.success) {
          throw new Error(response.data.message || PHONE_VERIFICATION_ERRORS.UPDATE.DEFAULT);
        }
      } else {
        // 모바일 환경에서는 기존 방식 사용
        const authHeader = await getAuthHeader();
        const response = await axios.post(
            `${API_URL}/api/users/${userId}/verifyPhone`,
            {phoneNumber: formatPhoneNumber(phone)},
            authHeader
        );
        
        if (!response.data.success) {
          throw new Error(response.data.message || PHONE_VERIFICATION_ERRORS.UPDATE.DEFAULT);
        }
      }

      console.log("전화번호 인증 상태 업데이트 성공");
      return true;
    } catch (error: any) {
      console.error("전화번호 인증 상태 업데이트 오류:", error);
      throw error;
    }
  };

  return {
    phone,
    setPhone,
    code,
    setCode,
    isLoading,
    isCodeSent,
    message,
    sendVerificationCode,
    verifyCode,
    resendVerificationCode,
    checkAuthStatus
  };
}

export default usePhoneAuth;