// 여행 테마 색상 팔레트
const primaryColor = '#4A89DC'; // 하늘색/바다색 - 자유와 모험
const accentColor = '#FF9500';  // 주황색/일몰색 - 따뜻함과 에너지
const secondaryColor = '#5AC8FA'; // 밝은 하늘색 - 신선함
const tertiaryColor = '#34C759'; // 녹색 - 자연, 탐험
const neutralLight = '#F5F5F7'; // 밝은 회색 - 배경
const neutralDark = '#333333';  // 어두운 회색 - 텍스트

const tintColorLight = primaryColor;
const tintColorDark = accentColor;

export default {
  light: {
    text: neutralDark,
    background: neutralLight,
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    primary: primaryColor,
    accent: accentColor,
    secondary: secondaryColor,
    tertiary: tertiaryColor,
    card: '#FFFFFF',
    border: '#E0E0E0',
  },
  dark: {
    text: '#fff',
    background: '#121212',
    tint: tintColorDark,
    tabIconDefault: '#888',
    tabIconSelected: tintColorDark,
    primary: primaryColor,
    accent: accentColor,
    secondary: secondaryColor,
    tertiary: tertiaryColor,
    card: '#1E1E1E',
    border: '#333333',
  },
};
