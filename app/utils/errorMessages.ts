// 전화번호 인증 관련 오류 메시지
export const PHONE_VERIFICATION_ERRORS = {
  // 인증 코드 발송 관련 오류
  SEND: {
    DEFAULT: "인증 코드 발송에 실패했습니다.",
    TOO_MANY_REQUESTS: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
    INVALID_PHONE_NUMBER: "유효하지 않은 전화번호입니다. 올바른 번호를 입력해주세요.",
    QUOTA_EXCEEDED: "일일 인증 코드 발송 한도를 초과했습니다. 내일 다시 시도해주세요.",
    EMPTY_PHONE: "전화번호를 입력해주세요.",
  },
  
  // 인증 코드 확인 관련 오류
  VERIFY: {
    DEFAULT: "인증 코드 확인에 실패했습니다.",
    INVALID_CODE: "잘못된 인증 코드입니다. 다시 확인해주세요.",
    EXPIRED_CODE: "인증 코드가 만료되었습니다. 재전송 버튼을 눌러 새로운 코드를 받아주세요.",
    TOO_MANY_ATTEMPTS: "너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.",
    EMPTY_CODE: "인증 코드를 입력해주세요.",
    GENERAL_ERROR: "인증 코드 확인 중 오류가 발생했습니다. 다시 시도해주세요.",
  },
  
  // 전화번호 인증 상태 업데이트 관련 오류
  UPDATE: {
    DEFAULT: "전화번호 인증 상태 업데이트에 실패했습니다.",
    NO_USER_ID: "사용자 ID가 없습니다. 로그인이 필요합니다.",
  },
  
  // 성공 메시지
  SUCCESS: {
    CODE_SENT: "인증 코드가 발송되었습니다. 몇 분 내로 도착합니다.",
    VERIFIED: "전화번호 인증이 완료되었습니다!",
    SENDING: "인증 코드를 발송 중입니다...",
    VERIFYING: "인증 코드를 확인 중입니다...",
  }
};

// 타입 정의
type ErrorType = 'SEND' | 'VERIFY' | 'UPDATE';

// 오류 메시지 매핑 함수
export const getPhoneVerificationErrorMessage = (
  errorType: ErrorType,
  errorMessage?: string
): string => {
  // 기본 오류 메시지
  if (!errorMessage) return PHONE_VERIFICATION_ERRORS[errorType].DEFAULT;
  
  // 에러 메시지 내용에 따른 매핑
  const lowerCaseError = errorMessage.toLowerCase();
  
  if (errorType === 'SEND') {
    const errors = PHONE_VERIFICATION_ERRORS.SEND;
    if (lowerCaseError.includes('too many requests')) return errors.TOO_MANY_REQUESTS;
    if (lowerCaseError.includes('invalid phone number')) return errors.INVALID_PHONE_NUMBER;
    if (lowerCaseError.includes('quota exceeded')) return errors.QUOTA_EXCEEDED;
  }
  
  if (errorType === 'VERIFY') {
    const errors = PHONE_VERIFICATION_ERRORS.VERIFY;
    if (lowerCaseError.includes('invalid code') || lowerCaseError.includes('code is incorrect')) {
      return errors.INVALID_CODE;
    }
    if (lowerCaseError.includes('expired')) return errors.EXPIRED_CODE;
    if (lowerCaseError.includes('too many attempts')) return errors.TOO_MANY_ATTEMPTS;
  }
  
  return PHONE_VERIFICATION_ERRORS[errorType].DEFAULT;
}; 