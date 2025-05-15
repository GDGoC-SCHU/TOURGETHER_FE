import React, {useEffect, useState, useRef} from 'react';
import {ActivityIndicator, Platform, StyleSheet, Text, View} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {useAuth} from '@/context/authContext';
import { handleKakaoLoginCallback } from './KakaoLogin';
import { handleGoogleLoginCallback } from './GoogleLogin';

/**
 * 소셜 로그인 콜백 처리 컴포넌트
 * 카카오와 구글 로그인 후 리다이렉트를 처리합니다.
 */
export default function SocialCallback() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {checkAuthStatus, isAuthenticated, needPhoneVerification} = useAuth();
  const params = useLocalSearchParams<{
    userId?: string;
    needPhoneVerification?: string;
    provider?: string;
  }>();
  const isMounted = useRef(true);
  const navigationTimeout = useRef<NodeJS.Timeout | null>(null);

  // 안전한 네비게이션 함수
  const safeNavigate = (path: any, delay: number = 300) => {
    // 이전 타이머가 있으면 취소
    if (navigationTimeout.current) {
      clearTimeout(navigationTimeout.current);
    }
    
    // 새로운 타이머 설정
    navigationTimeout.current = setTimeout(() => {
      if (isMounted.current) {
        try {
          router.replace(path);
        } catch (error) {
          console.error('네비게이션 오류:', error);
        }
      }
    }, delay);
  };

  useEffect(() => {
    // 컴포넌트 마운트 상태 설정
    isMounted.current = true;
    
    async function handleCallback() {
      console.log('SocialCallback 컴포넌트 로드됨');
      console.log('URL 파라미터:', params);

      if (Platform.OS !== 'web') {
        console.log('모바일 환경 감지, 홈으로 이동');
        safeNavigate('/');
        return;
      }

      try {
        // URL에서 직접 파라미터 확인 (useLocalSearchParams가 작동하지 않는 경우를 위해)
        const urlParams = new URLSearchParams(window.location.search);
        const urlUserId = urlParams.get('userId');
        const urlNeedPhoneVerification = urlParams.get('needPhoneVerification');
        const urlAccessToken = urlParams.get('accessToken');
        
        console.log('URL에서 직접 파라미터 확인:', { 
          userId: urlUserId, 
          needPhoneVerification: urlNeedPhoneVerification,
          accessToken: urlAccessToken ? '존재함' : '없음'
        });

        // URL에 파라미터가 있으면 바로 처리
        if (urlUserId && urlAccessToken) {
          console.log('URL 파라미터로 리다이렉트 처리');
          
          // URL에서 파라미터 제거 (깔끔한 URL 유지)
          if (typeof window !== 'undefined') {
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
          
          // 전화번호 인증이 필요한지 확인
          if (urlNeedPhoneVerification === 'true') {
            safeNavigate('/auth/VerifyPhone');
          } else {
            safeNavigate('/(tabs)');
          }
          return;
        }

        // 소셜 로그인 콜백 처리 시도
        const kakaoResult = handleKakaoLoginCallback();
        const googleResult = handleGoogleLoginCallback();
        const loginResult = kakaoResult || googleResult;

        // 콜백에서 로그인 정보를 가져온 경우
        if (loginResult) {
          console.log('소셜 로그인 콜백 처리 완료:', loginResult);
          
          // 전화번호 인증이 필요한지 확인
          if (loginResult.user.needPhoneVerification) {
            safeNavigate('/auth/VerifyPhone');
          } else {
            safeNavigate('/(tabs)');
          }
          return;
        }
        
        // 서버에 인증 상태 확인 요청 (쿠키 기반)
        console.log('서버에 인증 상태 확인 요청');
        const authStatus = await checkAuthStatus();
        
        console.log('인증 상태 확인 완료:', { 
          isAuthenticated, 
          needPhoneVerification,
          authStatus
        });
        
        // URL에서 쿼리 파라미터 제거 (보안)
        // SSR 환경에서는 window 객체가 없으므로 조건부 처리
        if (typeof window !== 'undefined' && window.location) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
        
        // 인증 상태에 따라 적절한 화면으로 이동
        if (isAuthenticated) {
          console.log('인증됨, 리다이렉트 처리');
          if (needPhoneVerification) {
            safeNavigate('/auth/VerifyPhone');
          } else {
            safeNavigate('/(tabs)');
          }
        } else {
          // URL 파라미터 확인 (OAuth2SuccessHandler에서 추가된 경우)
          if (params.userId) {
            console.log('params에서 userId 발견:', params.userId);
            // 전화번호 인증이 필요한지 확인
            if (params.needPhoneVerification === 'true') {
              safeNavigate('/auth/VerifyPhone');
            } else {
              safeNavigate('/(tabs)');
            }
          } else {
            // 인증 실패 시 로그인 페이지로
            console.log('인증 실패, 로그인 페이지로 리다이렉트');
            setError('인증에 실패했습니다. 다시 로그인해주세요.');
            safeNavigate('/auth/LoginScreen', 2000);
          }
        }
      } catch (err) {
        console.error('소셜 로그인 콜백 처리 오류:', err);
        setError('인증 정보 처리 중 오류가 발생했습니다.');
        safeNavigate('/auth/LoginScreen', 2000);
      } finally {
        setLoading(false);
      }
    }

    // 약간의 지연 후 콜백 처리 시작
    setTimeout(() => {
      if (isMounted.current) {
        handleCallback();
      }
    }, 100);

    // 컴포넌트 언마운트 시 정리
    return () => {
      isMounted.current = false;
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
    };
  }, []);

  if (loading) {
    return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#3897f0"/>
          <Text style={styles.text}>로그인 정보를 처리 중입니다...</Text>
        </View>
    );
  }

  if (error) {
    return (
        <View style={styles.container}>
          <Text style={styles.errorTitle}>로그인 처리 중 오류가 발생했습니다</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Text style={styles.suggestion}>다시 로그인을 시도해주세요.</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3897f0"/>
        <Text style={styles.text}>인증이 완료되었습니다. 리다이렉트 중...</Text>
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
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 15,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  suggestion: {
    fontSize: 16,
    color: '#555',
  },
});