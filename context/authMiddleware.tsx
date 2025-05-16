import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
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
  const {isAuthenticated, needPhoneVerification, loading, userId} = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const prevSegmentsRef = useRef<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const navigationTimeout = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  // 안전한 네비게이션 함수
  const safeNavigate = (path: any, delay: number = 100) => {
    // 이전 타이머가 있으면 취소
    if (navigationTimeout.current) {
      clearTimeout(navigationTimeout.current);
    }
    
    // 새로운 타이머 설정
    navigationTimeout.current = setTimeout(() => {
      if (isMounted.current) {
        try {
          router.replace(path);
        } catch (error) {
          console.error('네비게이션 오류:', error);
        }
      }
    }, delay);
  };

  // 보호된 라우트인지 확인 (인증 필요)
  const isProtectedRoute = (segments: string[]): boolean => {
    // 탭 그룹은 인증이 필요한 라우트
    return segments[0] === '(tabs)' || segments[0] === 'pages';
  };

  // 인증 관련 라우트인지 확인
  const isAuthRoute = (segments: string[]): boolean => {
    return segments[0] === 'auth';
  };

  // 현재 경로가 루트 경로인지 확인
  const isRootPath = (segments: string[]): boolean => {
    return segments.length === 0 || (segments.length === 1 && !segments[0]);
  };

  // URL 파라미터 확인 (웹 환경에서만)
  const checkUrlParams = (): { userId: string | null, needPhoneVerification: boolean, accessToken: string | null } => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlUserId = urlParams.get('userId');
      const urlNeedPhoneVerification = urlParams.get('needPhoneVerification') === 'true';
      const urlAccessToken = urlParams.get('accessToken');
      
      return { 
        userId: urlUserId, 
        needPhoneVerification: urlNeedPhoneVerification,
        accessToken: urlAccessToken
      };
    }
    
    return { 
      userId: null, 
      needPhoneVerification: false,
      accessToken: null
    };
  };

  // 컴포넌트 초기화
  useEffect(() => {
    // 컴포넌트가 마운트된 후 준비 상태로 설정
    isMounted.current = true;
    
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    
    return () => {
      isMounted.current = false;
      clearTimeout(timer);
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
    };
  }, []);

  // 라우트 보호 처리 함수
  const handleRouteProtection = () => {
    if (loading || !isReady) {
      console.log('로딩 중이거나 준비되지 않음, 라우팅 보호 건너뜀');
      return;
    }

    const inAuthGroup = isAuthRoute(segments);
    const inProtectedRoute = isProtectedRoute(segments);
    const inRootPath = isRootPath(segments);
    
    const segmentsStr = segments.join('/');
    console.log('인증 미들웨어 실행:', {
      isAuthenticated,
      needPhoneVerification,
      userId,
      segments: segmentsStr,
      inAuthGroup,
      inProtectedRoute,
      inRootPath
    });
    
    // URL 파라미터 확인
    const { userId: urlUserId, needPhoneVerification: urlNeedPhoneVerification, accessToken: urlAccessToken } = checkUrlParams();
    if (urlUserId && urlAccessToken) {
      console.log('URL 파라미터에서 인증 정보 발견:', { urlUserId, urlNeedPhoneVerification, accessToken: '존재함' });
      
      // URL 파라미터 제거
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
      
      // 전화번호 인증이 필요한 경우
      if (urlNeedPhoneVerification) {
        if (!inAuthGroup || (inAuthGroup && segments[1] !== 'Register')) {
          console.log('URL 파라미터: Register 페이지로 이동');
          safeNavigate('/auth/Register');
        }
        return;
      } else if (inAuthGroup || inRootPath) {
        console.log('URL 파라미터: 인증 완료, 탭 홈으로 이동');
        safeNavigate('/(tabs)');
        return;
      }
    }

    if (isAuthenticated) {
      // 인증된 사용자
      if (needPhoneVerification) {
        // 전화번호 인증이 필요하면 Register 페이지로
        if (!inAuthGroup || (inAuthGroup && segments[1] !== 'Register')) {
          console.log('Register 페이지로 이동 시도');
          try {
            safeNavigate('/auth/Register');
          } catch (error) {
            console.error('라우팅 오류:', error);
          }
        }
      } else if (inAuthGroup || inRootPath) {
        // 인증 완료 상태에서 인증 그룹이나 루트 경로에 있으면 탭 홈으로
        console.log('인증된 사용자: 탭 홈으로 이동 시도');
        
        try {
          safeNavigate('/(tabs)');
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
          safeNavigate('/');
        } catch (error) {
          console.error('라우팅 오류:', error);
        }
      } else if (inAuthGroup && segments[1] === 'Register') {
        // 인증되지 않은 상태에서 Register 페이지면 로그인으로
        console.log('인증되지 않은 사용자: Register 페이지 접근 시도, 로그인으로 이동 시도');
        try {
          safeNavigate('/auth/LoginScreen');
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
      
      // 약간의 지연 후 라우팅 처리 (마운트 문제 방지)
      setTimeout(() => {
        handleRouteProtection();
      }, 100);
    }
  }, [segments, isAuthenticated, needPhoneVerification, loading, userId, isReady]);

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