import React, {createContext, useContext, useEffect, useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import {Platform} from 'react-native';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  needPhoneVerification: boolean;
  loading: boolean;
  login: (tokens: TokenData) => Promise<void>;
  logout: () => Promise<void>;
  getAuthHeader: () => Promise<{ headers: { Authorization: string } }>;
}

interface TokenData {
  accessToken: string;
  refreshToken?: string | undefined;
  userId: string;
  needPhoneVerification?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 전역 인증 상태 저장소
let globalAuthState: AuthContextType = {
  isAuthenticated: false,
  userId: null,
  accessToken: null,
  refreshToken: null,
  needPhoneVerification: false,
  loading: true,
  login: async () => {
    console.warn('로그인 함수는 AuthProvider 내부에서만 사용할 수 있습니다.');
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

// 로컬 스토리지에서 인증 상태 로드
export async function loadAuthFromStorage(): Promise<void> {
  try {
    let token: string | null = null;
    let userIdValue: string | null = null;
    let needVerification: string | null = null;
    let refreshTokenValue: string | null = null;

    if (Platform.OS !== 'web') {
      // 모바일 환경
      token = await SecureStore.getItemAsync('accessToken');
      refreshTokenValue = await SecureStore.getItemAsync('refreshToken');
      userIdValue = await SecureStore.getItemAsync('userId');
      needVerification = await SecureStore.getItemAsync('needPhoneVerification');
    } else {
      // 웹 환경
      if (typeof window !== 'undefined' && window.localStorage) {
        token = localStorage.getItem('accessToken');
        refreshTokenValue = localStorage.getItem('refreshToken');
        userIdValue = localStorage.getItem('userId');
        needVerification = localStorage.getItem('needPhoneVerification');
      }
    }

    if (token) {
      globalAuthState = {
        ...globalAuthState,
        isAuthenticated: true,
        accessToken: token,
        refreshToken: refreshTokenValue,
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
  } catch (error) {
    console.error('인증 상태 로드 오류:', error);
    globalAuthState.loading = false;
  }
}

// 초기에 한 번 호출
loadAuthFromStorage();

export function AuthProvider({children}: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(globalAuthState.isAuthenticated);
  const [userId, setUserId] = useState<string | null>(globalAuthState.userId);
  const [accessToken, setAccessToken] = useState<string | null>(globalAuthState.accessToken);
  const [refreshToken, setRefreshToken] = useState<string | null>(globalAuthState.refreshToken);
  const [needPhoneVerification, setNeedPhoneVerification] = useState<boolean>(globalAuthState.needPhoneVerification);
  const [loading, setLoading] = useState<boolean>(globalAuthState.loading);

  // 초기 인증 상태 로드
  useEffect(() => {
    loadAuthState();
  }, []);

  async function loadAuthState() {
    try {
      let token: string | null = null;
      let userIdValue: string | null = null;
      let needVerification: string | null = null;
      let refreshTokenValue: string | null = null;

      if (Platform.OS !== 'web') {
        // 모바일 환경
        token = await SecureStore.getItemAsync('accessToken');
        refreshTokenValue = await SecureStore.getItemAsync('refreshToken');
        userIdValue = await SecureStore.getItemAsync('userId');
        needVerification = await SecureStore.getItemAsync('needPhoneVerification');
      } else {
        // 웹 환경
        if (typeof window !== 'undefined' && window.localStorage) {
          token = localStorage.getItem('accessToken');
          refreshTokenValue = localStorage.getItem('refreshToken');
          userIdValue = localStorage.getItem('userId');
          needVerification = localStorage.getItem('needPhoneVerification');
        }
      }

      if (token) {
        setIsAuthenticated(true);
        setAccessToken(token);
        setRefreshToken(refreshTokenValue);
        setUserId(userIdValue);
        setNeedPhoneVerification(needVerification === 'true');
      }
    } catch (error) {
      console.error('인증 상태 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  }

  async function login(tokens: TokenData) {
    try {
      const userIdStr = tokens.userId.toString();
      const needVerification = tokens.needPhoneVerification || false;

      if (Platform.OS !== 'web') {
        // 모바일 환경
        await SecureStore.setItemAsync('accessToken', tokens.accessToken);
        if (tokens.refreshToken) {
          await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
        }
        await SecureStore.setItemAsync('userId', userIdStr);
        await SecureStore.setItemAsync('needPhoneVerification', needVerification.toString());
      } else {
        // 웹 환경
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('accessToken', tokens.accessToken);
          if (tokens.refreshToken) {
            localStorage.setItem('refreshToken', tokens.refreshToken);
          }
          localStorage.setItem('userId', userIdStr);
          localStorage.setItem('needPhoneVerification', needVerification.toString());
        }
      }

      setIsAuthenticated(true);
      setAccessToken(tokens.accessToken);
      if (tokens.refreshToken) {
        setRefreshToken(tokens.refreshToken);
      }
      setUserId(userIdStr);
      setNeedPhoneVerification(needVerification);

      // 전역 상태 업데이트
      globalAuthState = {
        ...globalAuthState,
        isAuthenticated: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || null,
        userId: userIdStr,
        needPhoneVerification: needVerification
      };
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      if (Platform.OS !== 'web') {
        // 모바일 환경
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('userId');
        await SecureStore.deleteItemAsync('needPhoneVerification');
      } else {
        // 웹 환경
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('needPhoneVerification');
        }
      }

      setIsAuthenticated(false);
      setAccessToken(null);
      setRefreshToken(null);
      setUserId(null);
      setNeedPhoneVerification(false);

      // 전역 상태 업데이트
      globalAuthState = {
        ...globalAuthState,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        userId: null,
        needPhoneVerification: false
      };
    } catch (error) {
      console.error('로그아웃 오류:', error);
      throw error;
    }
  }

  async function getAuthHeader() {
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };
  }

  // 인증 상태 변경될 때마다 전역 상태 업데이트
  useEffect(() => {
    globalAuthState = {
      ...globalAuthState,
      isAuthenticated,
      userId,
      accessToken,
      refreshToken,
      needPhoneVerification,
      loading,
      login,
      logout,
      getAuthHeader
    };
  }, [isAuthenticated, userId, accessToken, refreshToken, needPhoneVerification, loading]);

  const value = {
    isAuthenticated,
    userId,
    accessToken,
    refreshToken,
    needPhoneVerification,
    loading,
    login,
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