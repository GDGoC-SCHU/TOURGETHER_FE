import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { Feather, MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

/**
 * 탭 네비게이션 레이아웃 컴포넌트
 * 앱의 주요 탭 화면들을 관리합니다.
 */
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
        borderTopWidth: 1,
        height: 60,
      },
      tabBarActiveTintColor: '#3897f0',
      tabBarInactiveTintColor: '#888',
      tabBarLabelStyle: {
        fontSize: 10,
        marginBottom: 5,
      }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="board"
        options={{
          title: '게시판',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="chat-bubble-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: '채팅',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chat-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이페이지',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-circle-o" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

/**
 * 탭 레이아웃 래퍼 컴포넌트
 */
export default function TabsLayoutWrapper() {
  return (
    <TabsLayout />
  );
} 