import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Platform, StyleSheet, Text, View} from 'react-native';
import {useRouter} from 'expo-router';
import {AuthProvider, useAuth} from '@/context/authContext';

// 실제 콜백 로직을 처리하는 내부 컴포넌트
function CallbackContent() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {login} = useAuth();

  useEffect(() => {
    async function handleCallback() {
      console.log('CallbackContent 컴포넌트 로드됨');

      if (Platform.OS !== 'web') {
        console.log('모바일 환경 감지, 홈으로 이동');
        router.replace('/');
        return;
      }

      try {
        // URL 쿼리 파라미터에서 토큰 정보 가져오기
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');
        const userId = urlParams.get('userId');
        const needPhoneVerification = urlParams.get('needPhoneVerification') === 'true';

        console.log('소셜 로그인 콜백 정보 확인:', {
          accessToken: accessToken ? '토큰 존재' : '토큰 없음',
          userId,
          needPhoneVerification
        });

        // 토큰 정보 유효성 검사
        if (!accessToken || !userId) {
          throw new Error('인증 정보가 누락되었습니다.');
        }

        // 로그인 처리 (토큰 저장)
        console.log('로그인 시도 중...');
        await login({
          accessToken,
          refreshToken: refreshToken || undefined,
          userId,
          needPhoneVerification
        });
        console.log('로그인 성공');

        // URL에서 쿼리 파라미터 제거 (보안)
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        // 적절한 페이지로 리다이렉트
        console.log('리다이렉트 시작', needPhoneVerification ? 'VerifyPhone으로' : '홈으로');

        setTimeout(() => {
          if (needPhoneVerification) {
            router.push('/auth/VerifyPhone');
          } else {
            router.push('/');
          }
        }, 100);
      } catch (err) {
        console.error('소셜 로그인 콜백 처리 오류:', err);
        setError(err instanceof Error ? err.message : '인증 정보 처리 중 오류가 발생했습니다.');
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