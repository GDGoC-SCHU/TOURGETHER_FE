import {useEffect, useRef, useState} from 'react';
import {Platform} from 'react-native';
import {useAuth} from '@/context/authContext';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {firebaseConfig} from '@/app/config/firebase';
import {API_URL} from '@/app/config/api';
import {useRouter} from 'expo-router';
import {PHONE_VERIFICATION_ERRORS, getPhoneVerificationErrorMessage} from '@/app/utils/errorMessages';

// Firebase 초기화
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

// 전화번호 형식 포맷팅
const formatPhoneNumber = (input: string): string => {
  // 개발 환경 테스트 번호 사용 코드 제거

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

  // Web reCAPTCHA
  const recaptchaVerifier = useRef<firebase.auth.RecaptchaVerifier | null>(null);
  const confirmationResultRef = useRef<firebase.auth.ConfirmationResult | null>(null);

  // reCAPTCHA 초기화 (웹 환경에서만)
  useEffect(() => {
    if (Platform.OS === 'web') {
      setupRecaptcha();

      return () => {
        cleanupRecaptcha();
      };
    }
  }, []);

  // reCAPTCHA 설정
  const setupRecaptcha = () => {
    try {
      // 웹 환경이 아니면 무시
      if (typeof document === 'undefined') {
        console.log('document is not defined, skipping reCAPTCHA setup');
        return;
      }

      // 이미 존재하는 verifier를 정리
      if (recaptchaVerifier.current) {
        try {
          recaptchaVerifier.current.clear();
          recaptchaVerifier.current = null;
        } catch (e) {
          console.error('Error clearing existing reCAPTCHA:', e);
        }
      }

      // reCAPTCHA 컨테이너 확인 또는 생성
      let recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        recaptchaContainer = document.createElement('div');
        recaptchaContainer.id = 'recaptcha-container';
        document.body.appendChild(recaptchaContainer);
      }

      // 컨테이너가 존재하는지 다시 확인
      if (!recaptchaContainer) {
        throw new Error('reCAPTCHA 컨테이너를 생성할 수 없습니다.');
      }

      // 컨테이너 스타일 설정
      if (recaptchaContainer.style) {
        recaptchaContainer.style.position = 'absolute';
        recaptchaContainer.style.bottom = '0';
        recaptchaContainer.style.right = '0';
        recaptchaContainer.style.opacity = '0.01'; // 완전히 숨기지 않고 약간 보이게 설정 (너무 숨기면 Google이 감지할 수 있음)
      } else {
        console.warn('reCAPTCHA 컨테이너에 style 속성이 없습니다.');
      }

      // reCAPTCHA 초기화
      recaptchaVerifier.current = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': () => console.log('reCAPTCHA resolved')
      });

      // reCAPTCHA 렌더링
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.render().then(() => {
          console.log('reCAPTCHA initialized and rendered successfully');
        }).catch(error => {
          console.error('reCAPTCHA render error:', error);
        });
        console.log('reCAPTCHA initialized');
      } else {
        console.error('Failed to initialize reCAPTCHA verifier');
      }
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
    }
  };

  // reCAPTCHA 정리
  const cleanupRecaptcha = () => {
    try {
      // document가 정의되지 않은 경우 (SSR 또는 RN 환경)
      if (typeof document === 'undefined') {
        return;
      }
      
      if (recaptchaVerifier.current) {
        try {
          recaptchaVerifier.current.clear();
          recaptchaVerifier.current = null;
        } catch (e) {
          console.error('Error clearing reCAPTCHA:', e);
        }
      }

      const container = document.getElementById('recaptcha-container');
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    } catch (error) {
      console.error('Error during reCAPTCHA cleanup:', error);
    }
  };

  // 인증 코드 발송
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

      // 백엔드에 요청하여 Firebase를 통해 인증 코드 발송
      try {
        if (Platform.OS === 'web') {
          // 웹 환경에서는 withCredentials 옵션 사용
          const response = await axios.post(
              `${API_URL}/api/phone/sendVerification`,
              {phoneNumber: formattedPhone},
              { withCredentials: true }
          );
          
          if (response.data.success) {
            setIsCodeSent(true);
            setMessage(PHONE_VERIFICATION_ERRORS.SUCCESS.CODE_SENT);
          } else {
            throw new Error(response.data.message || PHONE_VERIFICATION_ERRORS.SEND.DEFAULT);
          }
        } else {
          // 모바일 환경에서는 기존 방식 사용
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
        }
      } catch (error) {
        console.error("백엔드 인증 코드 발송 오류:", error);
        throw error;
      }
    } catch (error: any) {
      console.error("인증 코드 발송 오류:", error);
      
      // 오류 메시지를 사용자 친화적으로 변환
      const userFriendlyMessage = getPhoneVerificationErrorMessage('SEND', error.message);
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
      // 백엔드에 요청하여 인증 코드 확인
      try {
        if (Platform.OS === 'web') {
          // 웹 환경에서는 withCredentials 옵션 사용
          const response = await axios.post(
              `${API_URL}/api/phone/verifyCode`,
              {
                phoneNumber: formatPhoneNumber(phone),
                code: code
              },
              { withCredentials: true }
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
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              console.log("웹 환경에서 직접 URL 변경");
              window.location.href = '/(tabs)';
            }, 500);
          }
          
          return true;
        } else {
          // 모바일 환경에서는 기존 방식 사용
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
          setTimeout(() => {
            console.log("모바일 환경에서 router.replace 호출");
            router.replace('/(tabs)');
          }, 500);
          
          return true;
        }
      } catch (error: any) {
        console.error("백엔드 인증 코드 확인 오류:", error);
        
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
      }
    } catch (error: any) {
      console.error("인증 코드 확인 오류:", error);
      setMessage(PHONE_VERIFICATION_ERRORS.VERIFY.GENERAL_ERROR);
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

// 라우터를 위한 더미 컴포넌트
const PhoneAuthComponent = () => {
  usePhoneAuth();
  return null;
};

export default PhoneAuthComponent;