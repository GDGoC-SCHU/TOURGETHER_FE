import React from 'react';
import {Slot} from 'expo-router';
import {AuthProvider} from '@/context/authContext';
import {AuthMiddlewareProvider} from '@/context/authMiddleware';
import {LoadingScreen} from '@/components/loadingScreen';

export default function RootLayout() {
  return (
      <AuthProvider>
      <AuthMiddlewareProvider>
        <Slot />
      </AuthMiddlewareProvider>
      </AuthProvider>
  );
}