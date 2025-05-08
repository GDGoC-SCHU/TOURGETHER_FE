<<<<<<< HEAD
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

// 백엔드 서버 URL 설정
const BACKEND_URL = "http://localhost:8080";
const KAKAO_AUTH_URL = `${BACKEND_URL}/oauth2/authorization/kakao`;

=======
<<<<<<< HEAD
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// 백엔드 서버 URL 설정
const BACKEND_URL = 'http://localhost:8080';
=======
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

// 백엔드 서버 URL 설정
const BACKEND_URL = "http://localhost:8080";
>>>>>>> 7c5b914 ([feat] Verify-phone create)
const KAKAO_AUTH_URL = `${BACKEND_URL}/oauth2/authorization/kakao`;

>>>>>>> 74bfab2492d0e9efe69162fea2687ea77d8afd8c
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  needPhoneVerification: boolean;
  userId: number;
}

// 카카오 인증 응답 처리 함수
const handleKakaoAuthResponse = async (url: string): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    try {
      // JSON 응답 추출 로직
      const jsonMatch = url.match(/{.*}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const authData = JSON.parse(jsonStr) as AuthResponse;
        resolve(authData);
      } else {
        reject(new Error("JSON 데이터를 찾을 수 없습니다"));
      }
    } catch (error) {
      reject(error);
    }
  });
};

// URL 리스너 설정
<<<<<<< HEAD
=======
<<<<<<< HEAD
export const setupKakaoAuthListener = (callback: (response: AuthResponse) => void) => {
  // URL 이벤트 핸들러
  const handleUrl = async ({ url }: { url: string }) => {
    if (url && url.includes('auth-callback')) {
=======
>>>>>>> 74bfab2492d0e9efe69162fea2687ea77d8afd8c
export const setupKakaoAuthListener = (
  callback: (response: AuthResponse) => void
) => {
  // URL 이벤트 핸들러
  const handleUrl = async ({ url }: { url: string }) => {
    if (url && url.includes("auth-callback")) {
<<<<<<< HEAD
=======
>>>>>>> 7c5b914 ([feat] Verify-phone create)
>>>>>>> 74bfab2492d0e9efe69162fea2687ea77d8afd8c
      try {
        const authResponse = await handleKakaoAuthResponse(url);
        callback(authResponse);
      } catch (error) {
        console.error("인증 응답 처리 오류:", error);
      }
    }
  };

  // 이벤트 리스너 등록
<<<<<<< HEAD
  const subscription = Linking.addEventListener("url", handleUrl);

  // 앱이 이미 열려있고 URL로 실행된 경우 처리
  Linking.getInitialURL().then((url: string | null) => {
    if (url && url.includes("auth-callback")) {
=======
<<<<<<< HEAD
  const subscription = Linking.addEventListener('url', handleUrl);

  // 앱이 이미 열려있고 URL로 실행된 경우 처리
  Linking.getInitialURL().then((url: string | null) => {
    if (url && url.includes('auth-callback')) {
=======
  const subscription = Linking.addEventListener("url", handleUrl);

  // 앱이 이미 열려있고 URL로 실행된 경우 처리
  Linking.getInitialURL().then((url: string | null) => {
    if (url && url.includes("auth-callback")) {
>>>>>>> 7c5b914 ([feat] Verify-phone create)
>>>>>>> 74bfab2492d0e9efe69162fea2687ea77d8afd8c
      handleUrl({ url });
    }
  });

  // 리스너 제거 함수 반환
  return () => {
    subscription.remove();
  };
};

// 카카오 로그인 함수
export async function signInWithKakao(): Promise<{ token: string; user: any }> {
  // 앱으로 돌아올 콜백 URL 생성
<<<<<<< HEAD
  const redirectUrl = Linking.createURL("auth-callback");
=======
<<<<<<< HEAD
  const redirectUrl = Linking.createURL('auth-callback');
=======
  const redirectUrl = Linking.createURL("auth-callback");
>>>>>>> 7c5b914 ([feat] Verify-phone create)
>>>>>>> 74bfab2492d0e9efe69162fea2687ea77d8afd8c

  return new Promise((resolve, reject) => {
    // URL 리스너 설정
    const removeListener = setupKakaoAuthListener((authResponse) => {
      removeListener(); // 리스너 제거
      resolve({
        token: authResponse.accessToken,
        user: {
          id: authResponse.userId,
<<<<<<< HEAD
          needPhoneVerification: authResponse.needPhoneVerification,
        },
=======
<<<<<<< HEAD
          needPhoneVerification: authResponse.needPhoneVerification
        }
=======
          needPhoneVerification: authResponse.needPhoneVerification,
        },
>>>>>>> 7c5b914 ([feat] Verify-phone create)
>>>>>>> 74bfab2492d0e9efe69162fea2687ea77d8afd8c
      });
    });

    // 인증 세션 열기
    WebBrowser.openAuthSessionAsync(KAKAO_AUTH_URL, redirectUrl)
<<<<<<< HEAD
      .then((result) => {
        if (result.type !== "success") {
          removeListener(); // 리스너 제거
          reject(new Error("카카오 인증이 취소되었거나 실패했습니다"));
        }
        // 성공 시 리스너에서 resolve 처리
      })
      .catch((error) => {
        removeListener(); // 리스너 제거
        reject(error);
      });
=======
<<<<<<< HEAD
    .then((result) => {
      if (result.type !== 'success') {
        removeListener(); // 리스너 제거
        reject(new Error('카카오 인증이 취소되었거나 실패했습니다'));
      }
      // 성공 시 리스너에서 resolve 처리
    })
    .catch((error) => {
      removeListener(); // 리스너 제거
      reject(error);
    });
>>>>>>> 74bfab2492d0e9efe69162fea2687ea77d8afd8c
  });
}
=======
      .then((result) => {
        if (result.type !== "success") {
          removeListener(); // 리스너 제거
          reject(new Error("카카오 인증이 취소되었거나 실패했습니다"));
        }
        // 성공 시 리스너에서 resolve 처리
      })
      .catch((error) => {
        removeListener(); // 리스너 제거
        reject(error);
      });
  });
}
>>>>>>> 7c5b914 ([feat] Verify-phone create)
