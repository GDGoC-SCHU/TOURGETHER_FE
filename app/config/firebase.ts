// Firebase 설정 파일
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// App Check는 현재 문제가 있으므로 완전히 비활성화
// import 'firebase/compat/app-check';

// Firebase 구성
const firebaseConfig = {
  apiKey: "AIzaSyCbHQQxtNtc_TTjUxC5J_CuXeveCVJ_ip0",
  authDomain: "tripmate-test-18915.firebaseapp.com",
  projectId: "tripmate-test-18915",
  storageBucket: "tripmate-test-18915.firebasestorage.app",
  messagingSenderId: "344101713187",
  appId: "1:344101713187:web:2762e0ac061e64eb428896",
  measurementId: "G-968LWJ6V8D",
};

// Firebase 초기화 (앱이 이미 초기화되지 않았을 경우에만)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
  // 테스트 환경 설정 활성화
  if (typeof window !== 'undefined') {
    try {
      // reCAPTCHA 테스트 모드 활성화
      firebase.auth().settings.appVerificationDisabledForTesting = true;
    } catch (error) {
      console.error('Firebase 테스트 모드 설정 오류:', error);
    }
  }

  // App Check는 완전히 비활성화
}

// Firebase 인증 객체 가져오기
const auth = firebase.auth();

// 설정 내보내기
export { firebaseConfig, auth };

// 라우팅을 위한 기본 내보내기 컴포넌트
export default function FirebaseConfig() {
  // 라우팅을 위한 빈 컴포넌트
  return null;
} 