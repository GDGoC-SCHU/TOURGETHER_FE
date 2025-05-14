import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Platform, StyleSheet, Text, View} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {AuthProvider, useAuth} from '@/context/authContext';

// 실제 콜백 로직을 처리하는 내부 컴포넌트
function CallbackContent() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {checkAuthStatus, isAuthenticated, needPhoneVerification} = useAuth();
  const params = useLocalSearchParams<{
    userId?: string;
    needPhoneVerification?: string;
  }>();

  useEffect(() => {
    async function handleCallback() {
      console.log('CallbackContent 컴포넌트 로드됨');

      if (Platform.OS !== 'web') {
        console.log('모바일 환경 감지, 홈으로 이동');
        router.replace('/');
        return;
      }

      try {
        // 서버에 인증 상태 확인 요청 (쿠키 기반)
        await checkAuthStatus();
        
        console.log('인증 상태 확인 완료:', { isAuthenticated, needPhoneVerification });
        
        // URL에서 쿼리 파라미터 제거 (보안)
        // SSR 환경에서는 window 객체가 없으므로 조건부 처리
        if (typeof window !== 'undefined' && window.location) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
        
        // 인증 상태에 따라 적절한 화면으로 이동
        if (isAuthenticated) {
          if (needPhoneVerification) {
            router.replace('/auth/VerifyPhone');
          } else {
            router.replace('/(tabs)');
          }
        } else {
          // URL 파라미터 확인 (OAuth2SuccessHandler에서 추가된 경우)
          if (params.userId) {
            // 전화번호 인증이 필요한지 확인
            if (params.needPhoneVerification === 'true') {
              router.replace('/auth/VerifyPhone');
            } else {
              router.replace('/(tabs)');
            }
          } else {
            // 인증 실패 시 로그인 페이지로
            setError('인증에 실패했습니다. 다시 로그인해주세요.');
            setTimeout(() => {
              router.replace('/auth/LoginScreen');
            }, 2000);
          }
        }
      } catch (err) {
        console.error('소셜 로그인 콜백 처리 오류:', err);
        setError('인증 정보 처리 중 오류가 발생했습니다.');
        setTimeout(() => {
          router.replace('/auth/LoginScreen');
        }, 2000);
      } finally {
        setLoading(false);
      }
    }

    handleCallback();
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

// 메인 컴포넌트 - AuthProvider로 감싸서 내보내기
export default function SocialCallback() {
  return (
      <AuthProvider>
        <CallbackContent/>
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