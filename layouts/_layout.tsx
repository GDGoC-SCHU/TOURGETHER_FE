import React, {useEffect} from 'react';
import {Slot, useRouter, useSegments} from 'expo-router';
import {AuthProvider, useAuth} from '@/context/authContext';
import {LoadingScreen} from '@/components/loadingScreen';

export default function RootLayout() {
  return (
      <AuthProvider>
        <RootLayoutNavigation/>
      </AuthProvider>
  );
}

function RootLayoutNavigation() {
  const {isAuthenticated, loading, needPhoneVerification} = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (isAuthenticated) {
      // 인증된 사용자
      if (needPhoneVerification) {
        // 전화번호 인증이 필요하면 전화번호 인증 페이지로
        if (!inAuthGroup || (inAuthGroup && segments[1] !== 'VerifyPhone')) {
          router.replace('/auth/VerifyPhone');
        }
      } else if (inAuthGroup) {
        // 인증 완료 상태에서 인증 그룹에 있으면 홈으로
        router.replace('/');
      }
    } else {
      // 인증되지 않은 사용자
      if (inAuthGroup && segments[1] === 'VerifyPhone') {
        // 인증되지 않은 상태에서 전화번호 인증 페이지면 로그인으로
        router.replace('/auth/LoginScreen');
      }
      // 인증되지 않은 사용자는 비인증 홈과 로그인/회원가입 페이지에 접근 가능
    }
  }, [isAuthenticated, loading, needPhoneVerification, segments]);

  if (loading) {
    return <LoadingScreen/>;
  }

  return <Slot/>;
}