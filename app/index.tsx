import {Image} from "react-native";
import {useRouter} from "expo-router";
import {AuthProvider, useAuth} from "@/context/authContext";
import EditScreenInfo from "@/components/EditScreenInfo";
import {Text, View} from "@/components/Themed";
import {Button, ButtonContainer, ButtonText} from "@/styles/Button";
import {styles} from "@/styles/ViewStyle";

// 인증 확인 및 리다이렉트를 처리하는 내부 컴포넌트
function IndexContent() {
  const router = useRouter();
  const {isAuthenticated} = useAuth();

  // 인증 상태는 layouts/_layout.tsx에서 처리하므로 여기서는 제거

  const LoginhandlePress = () => {
    router.push("/auth/LoginScreen");
  };

  // 인증된 사용자는 미들웨어에서 리다이렉트되므로 여기서는 비인증 사용자용 UI만 표시
  return (
      <View style={styles.container}>
        <Image
            source={require("@/assets/images/logo.png")}
            style={{width: 300, height: 300, marginBottom: 20}}
            resizeMode="contain"
        />
        <Text style={styles.title}>Tourgether</Text>
        <Text style={styles.title}>함께하는 즐거움</Text>
        <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
        />
        <EditScreenInfo path="app/index.tsx"/>
        <ButtonContainer>
          <Button>
            <ButtonText>회원가입</ButtonText>
          </Button>
        </ButtonContainer>
        <ButtonContainer>
          <Button onPress={LoginhandlePress}>
            <ButtonText>로그인</ButtonText>
          </Button>
        </ButtonContainer>
      </View>
  );
}

// 메인 컴포넌트 - AuthProvider로 감싸서 내보내기
export default function Index() {
  return (
      <AuthProvider>
        <IndexContent/>
      </AuthProvider>
  );
}