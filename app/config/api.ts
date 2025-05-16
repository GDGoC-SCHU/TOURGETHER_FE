import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

// MIME 타입 매핑 함수
const getMimeType = (extension: string): string => {
  const mimeTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp'
  };
  return mimeTypes[extension.toLowerCase()] || 'image/jpeg';
};

// API 기본 URL
export const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8080';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // 웹에서는 쿠키 자동 전송을 위한 설정
  withCredentials: Platform.OS === 'web',
  // CORS 요청 시 쿠키 전송 허용
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// 웹 환경에서 localStorage의 토큰을 사용하는 인터셉터 추가
if (Platform.OS === 'web') {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

// 모바일 환경에서 요청 인터셉터 (토큰 헤더에 추가)
if (Platform.OS !== 'web') {
  api.interceptors.request.use(
    async (config) => {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // 모바일 환경에서 응답 인터셉터 (401 오류 처리)
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const refreshToken = await SecureStore.getItemAsync('refreshToken');
          
          if (!refreshToken) {
            throw new Error('리프레시 토큰이 없습니다');
          }
          
          const response = await api.post('/api/auth/refresh', { refreshToken });
          
          if (response.data.accessToken) {
            await SecureStore.setItemAsync('accessToken', response.data.accessToken);
            originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
            return api(originalRequest);
          }
          
          throw new Error('새 액세스 토큰을 받지 못했습니다');
        } catch (refreshError) {
          // 리프레시 실패 시 저장된 토큰 제거
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
          await SecureStore.deleteItemAsync('userId');
          await SecureStore.deleteItemAsync('needPhoneVerification');
          
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
}

// 웹 환경에서 응답 인터셉터 (401 오류 처리)
if (Platform.OS === 'web') {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // 리프레시 API 호출 경로인 경우 바로 에러 반환 (무한 루프 방지)
          if (originalRequest.url === '/api/auth/refresh' || originalRequest.url === '/api/auth/status') {
            // SSR 환경에서는 window 객체가 없으므로 조건부 처리
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/LoginScreen';
            }
            return Promise.reject(error);
          }
          
          // 웹 환경에서는 리프레시 API 호출 (서버에서 쿠키 기반으로 처리)
          await api.post('/api/auth/refresh');
          return api(originalRequest);
        } catch (refreshError) {
          // 리프레시 실패 시 로그인 페이지로 리다이렉트
          // SSR 환경에서는 window 객체가 없으므로 조건부 처리
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/LoginScreen';
          }
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
}

/**
 * 사용자 로그인 상태 확인
 * @returns {boolean} 로그인 여부
 */
export const isLoggedIn = () => {
  if (Platform.OS === 'web') {
    return !!localStorage.getItem("accessToken");
  } else {
    // 모바일 환경에서는 비동기 함수이므로 이 방식으로는 확인할 수 없음
    // 실제 사용시에는 async 함수로 구현해야 함
    return false;
  }
};

// 프로필 관련 API 함수
export const profileApi = {
  // 닉네임 중복 확인
  checkNickname: async (nickname: string) => {
    try {
      const response = await api.get('/api/user/nickname', {
        params: { nickname }
      });
      return response.data;
    } catch (error) {
      console.error('닉네임 중복 확인 오류:', error);
      throw error;
    }
  },

  // 태그 목록 조회
  getTags: async () => {
    try {
      const response = await api.get('/api/tags');
      return response.data;
    } catch (error) {
      console.error('태그 목록 조회 오류:', error);
      throw error;
    }
  },

  // 프로필 설정 (회원가입 완료)
  setupProfile: async (profileData: any, profileImage: any) => {
    try {
      console.log('프로필 설정 요청 데이터:', profileData);
      
      // 1. JSON 형식으로 프로필 데이터 전송
      const profileResponse = await api.post('/api/user/register', profileData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const userId = profileResponse.data.userId;
      console.log('프로필 생성 응답:', profileResponse.data);
      
      // 2. 프로필 이미지 전송 (별도 요청)
      if (profileImage && userId) {
        console.log('프로필 이미지 업로드 시작');
        const formData = new FormData();
        
        // 이미지 업로드용 FormData 구성 - 백엔드 파라미터명 "image"로 수정
        if (Platform.OS === 'web') {
          try {
            const response = await fetch(profileImage);
            const blob = await response.blob();
            formData.append('image', blob, 'profile.jpg');
          } catch (error) {
            console.error('이미지 처리 중 오류:', error);
            throw error;
          }
        } else {
          const fileInfo = await FileSystem.getInfoAsync(profileImage);
          
          if (fileInfo.exists) {
            const fileExtension = profileImage.split('.').pop() || 'jpg';
            const mimeType = getMimeType(fileExtension);
            
            formData.append('image', {
              uri: profileImage,
              name: `profile.${fileExtension}`,
              type: mimeType
            } as any);
          }
        }
        
        // HTTP 메서드를 PUT으로 변경 (백엔드와 일치)
        const imageResponse = await api.put(`/api/profile/${userId}/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log('이미지 업로드 응답:', imageResponse.data);
      }
      
      return profileResponse.data;
    } catch (error) {
      console.error('프로필 설정 오류:', error);
      throw error;
    }
  },

  // 프로필 조회
  getProfile: async (userId?: number) => {
    try {
      const endpoint = userId ? `/api/profile/${userId}` : '/api/profile/me';
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('프로필 조회 오류:', error);
      throw error;
    }
  },

  // 프로필 업데이트
  updateProfile: async (userId: number, profileData: any, profileImage: any) => {
    try {
      const formData = new FormData();
      
      // profileData를 JSON 문자열로 변환하여 추가
      formData.append('profileData', JSON.stringify({
        nickname: profileData.nickname,
        bio: profileData.bio,
        gender: profileData.gender,
        birthDate: profileData.birthDate,
        tags: profileData.tags
      }));
      
      // 이미지가 있는 경우 FormData에 추가
      if (profileImage) {
        if (Platform.OS === 'web') {
          try {
            const response = await fetch(profileImage);
            const blob = await response.blob();
            formData.append('profileImage', blob, 'profile.jpg');
          } catch (error) {
            console.error('이미지 처리 중 오류:', error);
            throw error;
          }
        } else {
          const fileInfo = await FileSystem.getInfoAsync(profileImage);
          
          if (fileInfo.exists) {
            const fileExtension = profileImage.split('.').pop() || 'jpg';
            const mimeType = getMimeType(fileExtension);
            
            formData.append('profileImage', {
              uri: profileImage,
              name: `profile.${fileExtension}`,
              type: mimeType
            } as any);
          }
        }
      }
      
      const response = await api.put(`/api/profile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      throw error;
    }
  }
};

// 파일 관련 API 함수
export const fileApi = {
  // 프로필 이미지 업로드
  uploadProfileImage: async (userId: number, imageFile: any) => {
    try {
      const formData = new FormData();
      
      // 이미지 업로드용 FormData 구성
      if (Platform.OS === 'web') {
        // 웹 환경 - imageFile이 이미 Blob 타입
        formData.append('image', imageFile, 'profile.jpg');
      } else {
        // 모바일 환경 - 객체를 any 타입으로 전달
        formData.append('image', imageFile as any);
      }
      
      const response = await api.put(`/api/profile/${userId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('프로필 이미지 업로드 오류:', error);
      throw error;
    }
  }
};

export default api;