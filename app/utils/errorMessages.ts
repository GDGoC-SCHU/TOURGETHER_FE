// Twilio 관련 에러 메시지 추가
export const PHONE_VERIFICATION_ERRORS = {
  SEND: {
    EMPTY_PHONE: "전화번호를 입력해주세요.",
    INVALID_FORMAT: "올바른 전화번호 형식이 아닙니다.",
    RATE_LIMITED: "인증 코드 발송 제한 중입니다. 잠시 후 다시 시도해주세요.",
    DEFAULT: "인증 코드 발송에 실패했습니다. 잠시 후 다시 시도해주세요."
  },
  VERIFY: {
    EMPTY_CODE: "인증 코드를 입력해주세요.",
    INVALID_CODE: "유효하지 않은 인증 코드입니다.",
    EXPIRED: "만료된 인증 코드입니다. 코드를 다시 요청해주세요.",
    DEFAULT: "인증 코드 확인에 실패했습니다. 다시 시도해주세요."
  },
  UPDATE: {
    NO_USER_ID: "사용자 정보를 찾을 수 없습니다.",
    DEFAULT: "전화번호 인증 상태 업데이트에 실패했습니다."
  },
  SUCCESS: {
    SENDING: "인증 코드를 발송 중입니다...",
    CODE_SENT: "인증 코드가 발송되었습니다. 휴대폰에서 확인해주세요.",
    VERIFYING: "인증 코드를 확인 중입니다...",
    VERIFIED: "전화번호 인증이 완료되었습니다."
  }
};

// 오류 메시지 변환 함수 (기존 코드에 있을 경우 수정)
export function getPhoneVerificationErrorMessage(type: 'SEND' | 'VERIFY' | 'UPDATE', error: string): string {
  // Twilio 특정 에러 처리
  if (error.includes('invalid phone number')) {
    return PHONE_VERIFICATION_ERRORS.SEND.INVALID_FORMAT;
  }
  
  if (error.includes('rate limit') || error.includes('제한 중')) {
    return PHONE_VERIFICATION_ERRORS.SEND.RATE_LIMITED;
  }
  
  if (error.includes('invalid code') || error.includes('incorrect code')) {
    return PHONE_VERIFICATION_ERRORS.VERIFY.INVALID_CODE;
  }
  
  if (error.includes('expired')) {
    return PHONE_VERIFICATION_ERRORS.VERIFY.EXPIRED;
  }
  
  // 기본 에러 처리
  switch (type) {
    case 'SEND':
      return PHONE_VERIFICATION_ERRORS.SEND.DEFAULT;
    case 'VERIFY':
      return PHONE_VERIFICATION_ERRORS.VERIFY.DEFAULT;
    case 'UPDATE':
      return PHONE_VERIFICATION_ERRORS.UPDATE.DEFAULT;
    default:
      return "알 수 없는 오류가 발생했습니다.";
  }
}


export default function ErrorMessages() {
  return null;
}