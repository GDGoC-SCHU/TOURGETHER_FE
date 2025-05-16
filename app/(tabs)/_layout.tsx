import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { Feather, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

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
        backgroundColor: Colors.light.card,
        borderTopColor: Colors.light.border,
        borderTopWidth: 1,
        height: 65,
        paddingBottom: 8,
        paddingTop: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
      },
      tabBarActiveTintColor: Colors.light.accent,
      tabBarInactiveTintColor: '#888',
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '500',
        marginBottom: 0,
      }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: focused ? Colors.light.accent + '20' : 'transparent',
              width: 50,
              height: 30,
              borderRadius: 15,
              marginBottom: 2,
            }}>
              <Feather name="compass" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="board"
        options={{
          title: 'Board',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: focused ? Colors.light.accent + '20' : 'transparent',
              width: 50,
              height: 30,
              borderRadius: 15,
              marginBottom: 2,
            }}>
              <MaterialIcons name="explore" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: focused ? Colors.light.accent + '20' : 'transparent',
              width: 50,
              height: 30,
              borderRadius: 15,
            }}>
              <MaterialCommunityIcons name="message-text-outline" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: 'My Page',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: focused ? Colors.light.accent + '20' : 'transparent',
              width: 50,
              height: 30,
              borderRadius: 15,
            }}>
              <FontAwesome5 name="user-alt" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="CreatingPlan"
        options={{
          href: null, // This screen will not be accessible from tab bar
        }}
      />
      <Tabs.Screen
        name="PlanResult"
        options={{
          href: null, // This screen will not be accessible from tab bar
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