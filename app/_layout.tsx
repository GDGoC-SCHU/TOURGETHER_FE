import React from 'react';
import {Stack} from 'expo-router';
import {AuthProvider} from '@/context/authContext';
import {AuthMiddlewareProvider} from '@/context/authMiddleware';

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