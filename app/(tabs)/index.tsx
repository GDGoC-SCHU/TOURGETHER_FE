import { Image } from "react-native";
import { useRouter } from "expo-router";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Button, ButtonContainer, ButtonText } from "../../styles/Button";
import { styles } from "../../styles/ViewStyle";

export default function Index() {
  const router = useRouter();
  const LoginhandlePress = () => {
    router.push("/auth/LoginScreen");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={{ width: 300, height: 300, marginBottom: 20 }}
        resizeMode="contain"
      />
      <Text style={styles.title}>Tourgether</Text>
      <Text style={styles.title}>함께하는 즐거움</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
      <ButtonContainer>
        <Button>
          <ButtonText>시작하기</ButtonText>
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
