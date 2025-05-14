import { useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function LoginSuccessPage() {
  const router = useRouter();
  const { token, mode } = useLocalSearchParams();

  useEffect(() => {
    if (typeof token === "string") {
      SecureStore.setItemAsync("accessToken", token).then(() => {
        if (mode === "signup") {
          router.replace("/auth/Register");
        } else {
          router.replace("/pages/Home");
        }
      });
    }
  }, [token, mode]);

  return null;
}
