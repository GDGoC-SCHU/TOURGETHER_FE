import axios from "axios";

const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:8080",
});

//intercept로 header 자동 설정
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//login 검증
export const isLoggedIn = () => {
  return !!localStorage.getItem("accessToken");
};

export default instance;