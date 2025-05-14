import React, {createContext, useContext, useEffect, useRef} from 'react';
import {useRouter, useSegments} from 'expo-router';
import {useAuth} from './authContext';
import {Platform} from 'react-native';

// 미들웨어 컨텍스트 타입 정의
interface AuthMiddlewareContextType {
  isProtectedRoute: (segments: string[]) => boolean;
  isAuthRoute: (segments: string[]) => boolean;
  handleRouteProtection: () => void;
}

// 미들웨어 컨텍스트 생성
const AuthMiddlewareContext = createContext<AuthMiddlewareContextType | null>(null);

// 미들웨어 제공자 컴포넌트
export function AuthMiddlewareProvider({children}: { children: React.ReactNode }) {
  const {isAuthenticated, needPhoneVerification, loading} = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const prevSegmentsRef = useRef<string[]>([]);

  // 보호된 라우트인지 확인 (인증 필요)
  const isProtectedRoute = (segments: string[]): boolean => {
    // 탭 그룹은 인증이 필요한 라우트
    return segments[0] === '(tabs)';
  };

  // 인증 관련 라우트인지 확인
  const isAuthRoute = (segments: string[]): boolean => {
    return segments[0] === 'auth';
  };

  // 현재 경로가 루트 경로인지 확인
  const isRootPath = (segments: string[]): boolean => {
    return segments.length === 0 || (segments.length === 1 && !segments[0]);
  };

  // 라우트 보호 처리 함수
  const handleRouteProtection = () => {
    if (loading) return;

    const inAuthGroup = isAuthRoute(segments);
    const inProtectedRoute = isProtectedRoute(segments);
    const inRootPath = isRootPath(segments);
    
    const segmentsStr = segments.join('/');
    console.log('인증 미들웨어 실행:', {
      isAuthenticated,
      needPhoneVerification,
      segments: segmentsStr,
      inAuthGroup,
      inProtectedRoute,
      inRootPath
    });

    if (isAuthenticated) {
      // 인증된 사용자
      if (needPhoneVerification) {
        // 전화번호 인증이 필요하면 전화번호 인증 페이지로
        if (!inAuthGroup || (inAuthGroup && segments[1] !== 'VerifyPhone')) {
          console.log('전화번호 인증 페이지로 이동 시도');
          try {
            router.replace('/auth/VerifyPhone');
          } catch (error) {
            console.error('라우팅 오류:', error);
          }
        }
      } else if (inAuthGroup || inRootPath) {
        // 인증 완료 상태에서 인증 그룹이나 루트 경로에 있으면 탭 홈으로
        console.log('인증된 사용자: 탭 홈으로 이동 시도');
        
        try {
          router.replace('/(tabs)');
        } catch (error) {
          console.error('라우팅 오류:', error);
        }
      }
    } else {
      // 인증되지 않은 사용자
      if (inProtectedRoute) {
        // 인증되지 않은 상태에서 보호된 라우트에 접근 시도하면 루트 경로로
        console.log('인증되지 않은 사용자: 보호된 라우트 접근 시도, 루트 경로로 이동 시도');
        
        try {
          router.replace('/');
        } catch (error) {
          console.error('라우팅 오류:', error);
        }
      } else if (inAuthGroup && segments[1] === 'VerifyPhone') {
        // 인증되지 않은 상태에서 전화번호 인증 페이지면 로그인으로
        console.log('인증되지 않은 사용자: 전화번호 인증 페이지 접근 시도, 로그인으로 이동 시도');
        try {
          router.replace('/auth/LoginScreen');
        } catch (error) {
          console.error('라우팅 오류:', error);
        }
      }
    }
  };

  // 라우트 변경 시 보호 로직 실행 (인증 상태 확인 제거)
  useEffect(() => {
    // 이전 세그먼트와 현재 세그먼트가 다른 경우에만 처리
    const prevSegmentsStr = prevSegmentsRef.current.join('/');
    const currentSegmentsStr = segments.join('/');
    
    if (prevSegmentsStr !== currentSegmentsStr) {
      console.log(`경로 변경 감지: ${prevSegmentsStr} -> ${currentSegmentsStr}`);
      prevSegmentsRef.current = segments;
      
      // 인증 상태는 다시 확인하지 않고 현재 상태로 라우팅 처리
      handleRouteProtection();
    }
  }, [segments, isAuthenticated, needPhoneVerification, loading]);

  // 제공할 값
  const value = {
    isProtectedRoute,
    isAuthRoute,
    handleRouteProtection
  };

  return (
    <AuthMiddlewareContext.Provider value={value}>
      {children}
    </AuthMiddlewareContext.Provider>
  );
}

// 미들웨어 훅
export function useAuthMiddleware() {
  const context = useContext(AuthMiddlewareContext);
  
  if (!context) {
    throw new Error('useAuthMiddleware must be used within an AuthMiddlewareProvider');
  }
  
  return context;
} 