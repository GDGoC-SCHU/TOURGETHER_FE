import styled from "styled-components/native";

/**
 * 버튼 컨테이너 스타일 컴포넌트
 * 버튼의 외부 컨테이너로 사용됩니다.
 */
export const ButtonContainer = styled.View`
  width: 100%;
  padding: 10px;
  align-items: center;
`;

/**
 * 기본 버튼 스타일 컴포넌트
 * 앱 전체에서 사용되는 기본 버튼 스타일입니다.
 */
export const Button = styled.TouchableOpacity`
  width: 80%;
  background-color: #4f46e5;
  border-radius: 10px;
  padding: 15px;
  align-items: center;
`;

/**
 * 버튼 텍스트 스타일 컴포넌트
 * 버튼 내부의 텍스트 스타일입니다.
 */
export const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

/**
 * 작은 버튼 스타일 컴포넌트
 * 작은 크기의 버튼에 사용됩니다.
 */
export const SmallButton = styled.TouchableOpacity`
  padding-vertical: 8px;
  padding-horizontal: 15px;
  background-color: #3897f0;
  border-radius: 8px;
  align-items: center;
`;

/**
 * 작은 버튼 텍스트 스타일 컴포넌트
 * 작은 버튼 내부의 텍스트 스타일입니다.
 */
export const SmallButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 500;
`;
