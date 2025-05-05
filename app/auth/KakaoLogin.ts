import * as AuthSession from "expo-auth-session";
import axios from "axios";

const REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY || "";
const REDIRECT_URI = AuthSession.makeRedirectUri();

const discovery = {
  authorizationEndpoint: "https://kauth.kakao.com/oauth/authorize",
  tokenEndpoint: "https://kauth.kakao.com/oauth/token",
};

export async function signInWithKakao() {
  const request = new AuthSession.AuthRequest({
    clientId:
      REST_API_KEY ||
      (() => {
        throw new Error("KAKAO_REST_API_KEY is not defined");
      })(),
    redirectUri: REDIRECT_URI,
    responseType: AuthSession.ResponseType.Code,
  });

  const result = await request.promptAsync(discovery);

  if (result.type !== "success" || !result.params.code) {
    throw new Error("Kakao login failed");
  }

  //Authorization code -> Access token 요청
  const tokenResponse = await axios.post(
    discovery.tokenEndpoint,
    new URLSearchParams({
      grant_type: "authorization_code",
      client_id: REST_API_KEY,
      redirect_uri: REDIRECT_URI,
      code: result.params.code,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  if (tokenResponse.status !== 200) {
    throw new Error("Failed to get access token");
  }

  const accessToken = tokenResponse.data.access_token;

  //사용자 정보 요청
  const userInfo = await axios.get("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return { token: accessToken, user: userInfo.data };
}
