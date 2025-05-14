import React, {createContext, useContext, useEffect, useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import {Platform} from 'react-native';
import api from '@/app/config/api';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  needPhoneVerification: boolean;
  loading: boolean;
  checkAuthStatus: () => Promise<void>;
  logout: () => Promise<void>;
  getAuthHeader: () => Promise<{ headers: { Authorization: string } }>;
}

interface TokenData {
  accessToken?: string;
  refreshToken?: string | undefined;
  userId: string;
  needPhoneVerification?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 전역 인증 상태 저장소
let globalAuthState: AuthContextType = {
  isAuthenticated: false,
  userId: null,
  needPhoneVerification: false,
  loading: true,
  checkAuthStatus: async () => {
    console.warn('인증 상태 확인 함수는 AuthProvider 내부에서만 사용할 수 있습니다.');
    throw new Error('Auth method not available outside AuthProvider');
  },
  logout: async () => {
    console.warn('로그아웃 함수는 AuthProvider 내부에서만 사용할 수 있습니다.');
    throw new Error('Auth method not available outside AuthProvider');
  },
  getAuthHeader: async () => ({
    headers: {Authorization: ''}
  })
};

// 초기에 한 번 호출
export async function loadAuthFromStorage(): Promise<void> {
  try {
    // 모바일 환경에서만 로컬 스토리지 확인
    if (Platform.OS !== 'web') {
      const token = await SecureStore.getItemAsync('accessToken');
      const refreshTokenValue = await SecureStore.getItemAsync('refreshToken');
      const userIdValue = await SecureStore.getItemAsync('userId');
      const needVerification = await SecureStore.getItemAsync('needPhoneVerification');

      if (token) {
        globalAuthState = {
          ...globalAuthState,
          isAuthenticated: true,
          userId: userIdValue,
          needPhoneVerification: needVerification === 'true',
          loading: false
        };
      } else {
        globalAuthState = {
          ...globalAuthState,
          loading: false
        };
      }
    } else {
      // 웹 환경에서는 서버 측 렌더링(SSR)과 클라이언트 측 렌더링을 구분
      // SSR 환경에서는 API 호출을 건너뜀
      if (typeof window === 'undefined') {
        console.log('SSR 환경 감지: 초기 인증 상태 확인 건너뜀');
        globalAuthState = {
          ...globalAuthState,
          loading: false
        };
        return;
      }
      
      // 클라이언트 측에서만 API 호출
      try {
        const response = await api.get('/api/auth/status');
        const { isAuthenticated, userId, needPhoneVerification } = response.data;
        
        globalAuthState = {
          ...globalAuthState,
          isAuthenticated: isAuthenticated || false,
          userId: userId ? userId.toString() : null,
          needPhoneVerification: needPhoneVerification || false,
          loading: false
        };
      } catch (error) {
        console.error('초기 인증 상태 확인 오류:', error);
        globalAuthState = {
          ...globalAuthState,
          loading: false
        };
      }
    }
  } catch (error) {
    console.error('인증 상태 로드 오류:', error);
    globalAuthState.loading = false;
  }
}

loadAuthFromStorage();

export function AuthProvider({children}: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(globalAuthState.isAuthenticated);
  const [userId, setUserId] = useState<string | null>(globalAuthState.userId);
  const [needPhoneVerification, setNeedPhoneVerification] = useState<boolean>(globalAuthState.needPhoneVerification);
  const [loading, setLoading] = useState<boolean>(globalAuthState.loading);

  // 서버에서 인증 상태 확인 함수
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // 백엔드에 인증 상태 확인 요청
      const response = await api.get('/api/auth/status');
      const { isAuthenticated: authStatus, userId: id, needPhoneVerification: needPhone } = response.data;
      
      console.log('인증 상태 확인 결과:', response.data);
      
      // 서버에서 받은 userId가 문자열이 아닌 경우 문자열로 변환
      const userId = id !== null && id !== undefined ? id.toString() : null;
      console.log('변환된 userId:', userId);
      
      setIsAuthenticated(authStatus || false);
      setUserId(userId);
      setNeedPhoneVerification(needPhone || false);
      
      // 모바일 환경에서는 토큰 정보 로컬 저장 (필요시)
      if (Platform.OS !== 'web' && authStatus && response.data.accessToken) {
        await SecureStore.setItemAsync('accessToken', response.data.accessToken);
        if (response.data.refreshToken) {
          await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);
        }
        // userId가 있을 경우에만 저장
        if (userId) {
          await SecureStore.setItemAsync('userId', userId);
        }
        await SecureStore.setItemAsync('needPhoneVerification', needPhone ? 'true' : 'false');
      }
      
      // 전역 상태 업데이트
      globalAuthState = {
        ...globalAuthState,
        isAuthenticated: authStatus || false,
        userId: userId,
        needPhoneVerification: needPhone || false
      };
      
      return authStatus;
    } catch (error) {
      console.error('인증 상태 확인 오류:', error);
      
      setIsAuthenticated(false);
      setUserId(null);
      setNeedPhoneVerification(false);
      
      // 모바일 환경에서 토큰 제거
      if (Platform.OS !== 'web') {
        try {
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
          await SecureStore.deleteItemAsync('userId');
          await SecureStore.deleteItemAsync('needPhoneVerification');
        } catch (e) {
          console.error('토큰 삭제 오류:', e);
        }
      }

      // 전역 상태 업데이트
      globalAuthState = {
        ...globalAuthState,
        isAuthenticated: false,
        userId: null,
        needPhoneVerification: false
      };
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 초기 인증 상태 로드
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 로그아웃 함수
  const logout = async () => {
    try {
      console.log('로그아웃 시작 - 현재 userId:', userId);
      
      // 백엔드에 로그아웃 요청 (쿠키 삭제)
      await api.post('/api/auth/logout');
      console.log('백엔드 로그아웃 요청 완료');
      
      // 모바일 환경에서 저장된 토큰 제거
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('userId');
        await SecureStore.deleteItemAsync('needPhoneVerification');
        console.log('모바일 토큰 삭제 완료');
      }

      // 상태 업데이트는 항상 마지막에 수행
      setIsAuthenticated(false);
      setUserId(null);
      setNeedPhoneVerification(false);
      console.log('로컬 상태 업데이트 완료');

      // 전역 상태 업데이트
      globalAuthState = {
        ...globalAuthState,
        isAuthenticated: false,
        userId: null,
        needPhoneVerification: false
      };
      console.log('전역 상태 업데이트 완료');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      throw error;
    }
  };

  // 인증 헤더 가져오기 함수 (모바일 환경용)
  const getAuthHeader = async () => {
    if (Platform.OS !== 'web') {
      const token = await SecureStore.getItemAsync('accessToken');
    return {
      headers: {
          Authorization: token ? `Bearer ${token}` : ''
      }
    };
  }
    
    // 웹 환경에서는 빈 헤더 반환 (쿠키가 자동으로 전송됨)
    return { headers: { Authorization: '' } };
  };

  // 인증 상태 변경될 때마다 전역 상태 업데이트
  useEffect(() => {
    globalAuthState = {
      ...globalAuthState,
      isAuthenticated,
      userId,
      needPhoneVerification,
      loading,
      checkAuthStatus,
      logout,
      getAuthHeader
    };
  }, [isAuthenticated, userId, needPhoneVerification, loading]);

  const value = {
    isAuthenticated,
    userId,
    needPhoneVerification,
    loading,
    checkAuthStatus,
    logout,
    getAuthHeader
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    // 컨텍스트가 없을 때는 전역 상태 반환 (경고 출력)
    if (__DEV__) { // 개발 모드에서만 경고 출력
      console.warn('useAuth가 AuthProvider 외부에서 호출됨. 제한된 기능만 사용 가능합니다.');
    }
    return globalAuthState;
  }

  return context;
}