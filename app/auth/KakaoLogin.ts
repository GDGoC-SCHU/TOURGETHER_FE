import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import {Platform} from "react-native";
import { API_URL } from "@/app/config/api";

// 카카오 인증 URL
const KAKAO_AUTH_URL = `${API_URL}/oauth2/authorization/kakao`;

/**
 * 카카오 로그인 시작 함수
 * 플랫폼에 따라 적절한 로그인 방식을 사용합니다.
 */
export async function signInWithKakao(): Promise<{
  token: string;
  refreshToken: string | undefined;
  user: any
}> {
  console.log("카카오 로그인 시작");

  if (Platform.OS === 'web') {
    // 웹 환경에서는 직접 리다이렉트 사용
    return webKakaoLoginDirect();
  } else {
    // 네이티브 환경에서는 WebBrowser 사용
    return nativeKakaoLogin();
  }
}

/**
 * 웹 환경에서 현재 창에서 직접 리다이렉트 사용하는 카카오 로그인
 */
function webKakaoLoginDirect(): Promise<{
  token: string;
  refreshToken: string | undefined;
  user: any
}> {
  return new Promise((resolve, reject) => {
    try {
      console.log("직접 리다이렉트로 카카오 로그인 시작");

      // 먼저 이미 URL에 토큰 정보가 있는지 확인
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      const refreshToken = urlParams.get('refreshToken');
      const userId = urlParams.get('userId');
      const needPhoneVerification = urlParams.get('needPhoneVerification') === 'true';

      // 이미 토큰 정보가 URL에 있다면 처리
      if (accessToken && userId) {
        console.log("URL에서 카카오 로그인 정보 감지됨", {
          accessToken,
          refreshToken,
          userId,
          needPhoneVerification
        });

        // URL에서 파라미터 제거 (깔끔한 URL 유지)
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        // 로그인 성공 결과 반환
        resolve({
          token: accessToken,
          refreshToken: refreshToken || undefined, // null을 undefined로 변환
          user: {
            id: parseInt(userId),
            needPhoneVerification
          }
        });

        return;
      }

      // 토큰 정보가 없다면 로그인 페이지로 리다이렉트
      // 현재 URL을 socialCallback 페이지로 설정
      const callbackUrl = `${window.location.origin}/auth/socialCallback`;
      console.log("콜백 URL:", callbackUrl);

      // 리다이렉트 URL 구성 - 웹 환경용 특수 파라미터 추가
      const redirectUrl = `${KAKAO_AUTH_URL}?web=true`;

      console.log("카카오 인증 페이지로 리다이렉트:", redirectUrl);

      // 현재 창에서 직접 리다이렉트
      window.location.href = redirectUrl;

    } catch (error) {
      console.error("웹 카카오 로그인 오류:", error);
      reject(error);
    }
  });
}

/**
 * 네이티브 환경에서 WebBrowser를 사용하는 카카오 로그인
 */
function nativeKakaoLogin(): Promise<{
  token: string;
  refreshToken: string | undefined;
  user: any
}> {
  return new Promise((resolve, reject) => {
    // URL 이벤트 핸들러
    const handleUrl = async ({url}: { url: string }) => {
      console.log("URL 이벤트 받음:", url);

      if (url && (url.includes("auth-callback") || url.includes("auth/VerifyPhone"))) {
        try {
          // 브라우저 세션 닫기 시도
          try {
            await WebBrowser.dismissAuthSession();
          } catch (e) {
            console.warn("브라우저 세션 닫기 오류:", e);
          }

          // URL 파라미터 추출
          const urlObj = new URL(url);
          const accessToken = urlObj.searchParams.get("accessToken");
          const refreshToken = urlObj.searchParams.get("refreshToken");
          const userId = urlObj.searchParams.get("userId");
          const needPhoneVerification = urlObj.searchParams.get("needPhoneVerification");

          if (!accessToken || !userId) {
            throw new Error("인증 정보가 부족합니다");
          }

          // 로그인 데이터 반환
          resolve({
            token: accessToken,
            refreshToken: refreshToken || undefined, // null을 undefined로 변환
            user: {
              id: parseInt(userId),
              needPhoneVerification: needPhoneVerification === "true",
            },
          });
        } catch (error) {
          console.error("URL 처리 오류:", error);
          reject(error);
        } finally {
          // 리스너 제거
          subscription.remove();
        }
      }
    };

    // URL 리스너 등록
    const subscription = Linking.addEventListener("url", handleUrl);

    // 네이티브 리다이렉트 URL
    const redirectUrl = "tourgether://auth-callback";
    console.log("네이티브 리다이렉트 URL:", redirectUrl);

    // 인증 세션 열기
    WebBrowser.openAuthSessionAsync(KAKAO_AUTH_URL, redirectUrl)
    .then((result) => {
      console.log("WebBrowser 결과:", result);

      // 성공, dismiss 이외의 결과는 취소/실패로 처리
      if (result.type !== "success" && result.type !== "dismiss") {
        subscription.remove();
        reject(new Error("카카오 인증이 취소되었거나 실패했습니다"));
      }
    })
    .catch((error) => {
      console.error("WebBrowser 오류:", error);
      subscription.remove();
      reject(error);
    });
  });
}

/**
 * 로그인 콜백 처리 함수 (웹 환경 전용)
 */
export function handleKakaoLoginCallback(): {
  token: string,
  refreshToken: string | undefined,
  user: any
} | null {
  if (Platform.OS !== 'web') return null;

  // URL 파라미터에서 토큰 정보 확인
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('accessToken');
  const refreshToken = urlParams.get('refreshToken');
  const userId = urlParams.get('userId');
  const needPhoneVerification = urlParams.get('needPhoneVerification') === 'true';

  if (accessToken && userId) {
    console.log("URL에서 카카오 로그인 정보 감지됨");

    // URL에서 파라미터 제거 (깔끔한 URL 유지)
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    // 로그인 정보 반환
    return {
      token: accessToken,
      refreshToken: refreshToken || undefined, // null을 undefined로 변환
      user: {
        id: parseInt(userId),
        needPhoneVerification
      }
    };
  }

  return null;
}

// 라우팅을 위한 기본 내보내기 컴포넌트
export default function KakaoLoginComponent() {
  // 라우팅을 위한 빈 컴포넌트
  return null;
}