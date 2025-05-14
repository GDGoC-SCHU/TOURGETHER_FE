import React from 'react';
import { Tabs } from 'expo-router';
import { useAuth } from '@/context/authContext';

function TabsLayout() {
  const { isAuthenticated, needPhoneVerification, loading } = useAuth();

  // 로딩 중이거나 인증되지 않은 상태면 빈 화면 렌더링
  // 실제 리다이렉션은 authMiddleware에서 처리
  if (loading || !isAuthenticated || needPhoneVerification) {
    return null;
  }

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { 
        backgroundColor: '#fff',
        borderTopColor: '#eee',
      },
      tabBarActiveTintColor: '#3897f0',
      tabBarInactiveTintColor: '#888',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// 간단한 아이콘 컴포넌트
function TabBarIcon({ name, color }: { name: string; color: string }) {
  // 실제 앱에서는 아이콘 라이브러리를 사용하세요
  return (
    <div style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 12 }} />
  );
}

export default function TabsLayoutWrapper() {
  return (
    <TabsLayout />
  );
} 