import {useEffect, useRef, useState} from 'react';
import {Platform} from 'react-native';
import {useAuth} from '@/context/authContext';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {firebaseConfig} from '@/app/config/firebase';
import {API_URL} from '@/app/config/api';

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
  const {userId, getAuthHeader} = useAuth();

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
      setMessage("전화번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setMessage("인증 코드를 발송 중입니다...");

    try {
      const formattedPhone = formatPhoneNumber(phone);
      console.log(`인증 코드 발송 중: ${formattedPhone}`);

      // 백엔드에 요청하여 Firebase를 통해 인증 코드 발송
      try {
        const authHeader = await getAuthHeader();
        const response = await axios.post(
            `${API_URL}/api/phone/sendVerification`,
            {phoneNumber: formattedPhone},
            authHeader
        );

        if (response.data.success) {
          setIsCodeSent(true);
          setMessage("인증 코드가 발송되었습니다. 몇 분 내로 도착합니다.");
        } else {
          throw new Error(response.data.message || "인증 코드 발송에 실패했습니다.");
        }
      } catch (error) {
        console.error("백엔드 인증 코드 발송 오류:", error);
        throw error;
      }
    } catch (error: any) {
      console.error("인증 코드 발송 오류:", error);
      setMessage(`인증 코드 발송 실패: ${error.message || "알 수 없는 오류가 발생했습니다."}`);
      setIsCodeSent(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 인증 코드 확인
  const verifyCode = async () => {
    if (!code) {
      setMessage("인증 코드를 입력해주세요.");
      return false;
    }

    setIsLoading(true);
    setMessage("인증 코드를 확인 중입니다...");

    try {
      // 백엔드에 요청하여 인증 코드 확인
      try {
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
          throw new Error(response.data.message || "인증 코드 확인에 실패했습니다.");
        }
        
        setMessage("전화번호 인증이 완료되었습니다!");
        return true;
      } catch (error: any) {
        console.error("백엔드 인증 코드 확인 오류:", error);
        setMessage(`인증 코드 확인 실패: ${error.message || "알 수 없는 오류가 발생했습니다."}`);
        return false;
      }
    } catch (error: any) {
      console.error("인증 코드 확인 오류:", error);
      setMessage(`인증 코드 확인 실패: ${error.message || "알 수 없는 오류가 발생했습니다."}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 백엔드에 전화번호 인증 상태 업데이트
  const updatePhoneVerificationStatus = async () => {
    try {
      if (!userId) {
        throw new Error("사용자 ID가 없습니다. 로그인이 필요합니다.");
      }

      const authHeader = await getAuthHeader();
      const response = await axios.post(
          `${API_URL}/api/users/${userId}/verifyPhone`,
          {phoneNumber: formatPhoneNumber(phone)},
          authHeader
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "전화번호 인증 상태 업데이트에 실패했습니다.");
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
    verifyCode
  };
}

// 라우터를 위한 더미 컴포넌트
const PhoneAuthComponent = () => {
  usePhoneAuth();
  return null;
};

export default PhoneAuthComponent;