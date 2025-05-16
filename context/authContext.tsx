import React, {createContext, useContext, useEffect, useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import {Platform} from 'react-native';
import api from '@/app/config/api';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  needPhoneVerification: boolean;
  loading: boolean;
  user: any | null;
  checkAuthStatus: () => Promise<boolean>;
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
  user: null,
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
    // 모바일 환경에서는 SecureStore 사용
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
      // 웹 환경에서는 localStorage 사용
      if (typeof window === 'undefined') {
        console.log('SSR 환경 감지: 초기 인증 상태 확인 건너뜀');
        globalAuthState = {
          ...globalAuthState,
          loading: false
        };
        return;
      }
      
      // 로컬 스토리지에서 토큰 확인
      const token = localStorage.getItem('accessToken');
      const userIdValue = localStorage.getItem('userId');
      const needVerification = localStorage.getItem('needPhoneVerification');
      
      if (token) {
        globalAuthState = {
          ...globalAuthState,
          isAuthenticated: true,
          userId: userIdValue,
          needPhoneVerification: needVerification === 'true',
          loading: false
        };
        return;
      }
      
      // 토큰이 없으면 API 호출하여 상태 확인
      try {
        const response = await api.get('/api/auth/status', { withCredentials: true });
        const { isAuthenticated, userId, needPhoneVerification, accessToken } = response.data;
        
        // 토큰이 응답에 포함된 경우 저장
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
        
        if (userId) {
          localStorage.setItem('userId', userId.toString());
        }
        
        if (needPhoneVerification !== undefined) {
          localStorage.setItem('needPhoneVerification', needPhoneVerification ? 'true' : 'false');
        }
        
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
  const [user, setUser] = useState<any | null>(null);

  // 서버에서 인증 상태 확인 함수
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      console.log('인증 상태 확인 시작');
      
      // URL 파라미터에서 인증 정보 확인 (웹 환경에서만)
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const urlUserId = urlParams.get('userId');
        const urlNeedPhoneVerification = urlParams.get('needPhoneVerification') === 'true';
        const urlAccessToken = urlParams.get('accessToken');
        
        console.log('URL 파라미터 확인:', { urlUserId, urlNeedPhoneVerification, urlAccessToken: urlAccessToken ? 'exists' : 'not found' });
        
        if (urlUserId && urlAccessToken) {
          console.log('URL에서 인증 정보 발견, 상태 업데이트');
          setIsAuthenticated(true);
          setUserId(urlUserId);
          setNeedPhoneVerification(urlNeedPhoneVerification);
          
          // 웹 환경의 로컬 스토리지에 토큰 저장
          localStorage.setItem('accessToken', urlAccessToken);
          localStorage.setItem('userId', urlUserId);
          localStorage.setItem('needPhoneVerification', urlNeedPhoneVerification ? 'true' : 'false');
          
          // 전역 상태 업데이트
          globalAuthState = {
            ...globalAuthState,
            isAuthenticated: true,
            userId: urlUserId,
            needPhoneVerification: urlNeedPhoneVerification
          };
          
          setLoading(false);
          return true;
        }
      }
      
      // 로컬 스토리지나 SecureStore에서 토큰 확인
      let storedToken = null;
      let storedUserId = null;
      let storedNeedPhoneVerification = false;
      
      if (Platform.OS === 'web') {
        storedToken = localStorage.getItem('accessToken');
        storedUserId = localStorage.getItem('userId');
        storedNeedPhoneVerification = localStorage.getItem('needPhoneVerification') === 'true';
      } else {
        storedToken = await SecureStore.getItemAsync('accessToken');
        storedUserId = await SecureStore.getItemAsync('userId');
        storedNeedPhoneVerification = await SecureStore.getItemAsync('needPhoneVerification') === 'true';
      }
      
      // 저장된 토큰이 있으면 인증 상태 업데이트
      if (storedToken && storedUserId) {
        console.log('저장된 토큰 발견:', { token: 'exists', userId: storedUserId });
        setIsAuthenticated(true);
        setUserId(storedUserId);
        setNeedPhoneVerification(storedNeedPhoneVerification);
        
        // 전역 상태 업데이트
        globalAuthState = {
          ...globalAuthState,
          isAuthenticated: true,
          userId: storedUserId,
          needPhoneVerification: storedNeedPhoneVerification
        };
        
        setLoading(false);
        return true;
      }
      
      // 백엔드에 인증 상태 확인 요청
      const response = await api.get('/api/auth/status', { withCredentials: true });
      console.log('백엔드 응답:', response.data);
      
      const { isAuthenticated: authStatus, userId: id, needPhoneVerification: needPhone, accessToken } = response.data;
      
      // 서버에서 받은 userId가 문자열이 아닌 경우 문자열로 변환
      const userIdStr = id !== null && id !== undefined ? id.toString() : null;
      console.log('변환된 userId:', userIdStr);
      
      setIsAuthenticated(authStatus || false);
      setUserId(userIdStr);
      setNeedPhoneVerification(needPhone || false);
      
      // 토큰 저장
      if (authStatus && accessToken) {
        if (Platform.OS === 'web') {
          localStorage.setItem('accessToken', accessToken);
          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }
          if (userIdStr) {
            localStorage.setItem('userId', userIdStr);
          }
          localStorage.setItem('needPhoneVerification', needPhone ? 'true' : 'false');
        } else {
          await SecureStore.setItemAsync('accessToken', accessToken);
          if (response.data.refreshToken) {
            await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);
          }
          if (userIdStr) {
            await SecureStore.setItemAsync('userId', userIdStr);
          }
          await SecureStore.setItemAsync('needPhoneVerification', needPhone ? 'true' : 'false');
        }
      }
      
      // 전역 상태 업데이트
      globalAuthState = {
        ...globalAuthState,
        isAuthenticated: authStatus || false,
        userId: userIdStr,
        needPhoneVerification: needPhone || false
      };
      
      console.log('인증 상태 업데이트 완료:', {
        isAuthenticated: authStatus || false,
        userId: userIdStr,
        needPhoneVerification: needPhone || false
      });
      
      return authStatus || false;
    } catch (error) {
      console.error('인증 상태 확인 오류:', error);
      
      setIsAuthenticated(false);
      setUserId(null);
      setNeedPhoneVerification(false);
      
      // 토큰 제거
      if (Platform.OS === 'web') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('needPhoneVerification');
      } else {
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
      const authHeader = await getAuthHeader();
      await api.post('/api/auth/logout', {}, { 
        withCredentials: true,
        headers: authHeader.headers 
      });
      console.log('백엔드 로그아웃 요청 완료');
      
      // 토큰 제거
      if (Platform.OS === 'web') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('needPhoneVerification');
      } else {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('userId');
        await SecureStore.deleteItemAsync('needPhoneVerification');
      }
      console.log('토큰 삭제 완료');

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

  // 인증 헤더 가져오기 함수
  const getAuthHeader = async () => {
    let token = '';
    
    if (Platform.OS !== 'web') {
      token = await SecureStore.getItemAsync('accessToken') || '';
    } else {
      token = localStorage.getItem('accessToken') || '';
    }
    
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    };
  };

  // 인증 상태 변경될 때마다 전역 상태 업데이트
  useEffect(() => {
    globalAuthState = {
      ...globalAuthState,
      isAuthenticated,
      userId,
      needPhoneVerification,
      loading,
      user,
      checkAuthStatus,
      logout,
      getAuthHeader
    };
  }, [isAuthenticated, userId, needPhoneVerification, loading, user]);

  const value = {
    isAuthenticated,
    userId,
    needPhoneVerification,
    loading,
    user,
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