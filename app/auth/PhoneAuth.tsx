import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

/**
 * 전화번호 인증 화면
 * VerifyPhone.tsx로 리디렉션합니다.
 */
export default function PhoneAuthScreen() {
  const router = useRouter();
  
  // 컴포넌트가 마운트되면 VerifyPhone으로 리디렉션
  React.useEffect(() => {
    router.replace('/auth/VerifyPhone');
  }, [router]);
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>리디렉션 중...</Text>
    </View>
  );
} 