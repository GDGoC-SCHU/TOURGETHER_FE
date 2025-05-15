import React from 'react';
import {Stack} from 'expo-router';
import {AuthProvider} from '@/context/authContext';
import {AuthMiddlewareProvider} from '@/context/authMiddleware';

/**
 * 앱의 루트 레이아웃 컴포넌트
 * 인증 관련 컨텍스트 제공자와 라우팅 스택을 설정합니다.
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthMiddlewareProvider>
        <Stack screenOptions={{
          headerShown: false,
          headerTitle: ''
        }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth/LoginScreen" />
          <Stack.Screen name="auth/VerifyPhone" />
          <Stack.Screen name="auth/socialCallBack" />
        </Stack>
      </AuthMiddlewareProvider>
    </AuthProvider>
  );
} 