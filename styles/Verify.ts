import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  justify-content: space-between;
  padding-top: 70px;
  padding-bottom: 70px;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;
`;

export const Header = styled.View`
  width: 100%;
`;

export const Footer = styled.View`
  width: 100%;
  align-items: center;
`;

export const InputGroup = styled.View`
  width: 100%;
  align-items: center;
  margin-bottom: 24px;
`;

// TextInput 스타일
export const StyledTextInput = styled.TextInput`
  width: 260px;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 8px;
`;

// 작은 버튼
export const SmallButton = styled.TouchableOpacity`
  padding-vertical: 6px;
  padding-horizontal: 12px;
  background-color: #007bff;
  border-radius: 10px;
  align-self: center; /* 그룹 안에서 가로 중앙 */
`;

export const SmallButtonText = styled.Text`
  color: white;
  font-size: 14px;
`;
