import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "@/styles/ViewStyle";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

/**
 * 앱 하단 네비게이션 바 컴포넌트
 * 홈, 게시판, 채팅, 마이페이지로 이동할 수 있는 아이콘 버튼을 제공합니다.
 */
export default function NavBar() {
  const router = useRouter();
  
  // 네비게이션 아이템 정의
  const navItems = [
    { name: "HOME", icon: <Feather name="home" size={24} color="black" />, path: "/(tabs)" },
    { name: "BOARD", icon: <MaterialIcons name="chat-bubble-outline" size={24} color="black" />, path: "/pages/Home" },
    { name: "CHAT", icon: <MaterialCommunityIcons name="chat-outline" size={24} color="black" />, path: "/pages/Home" },
    { name: "MY", icon: <FontAwesome name="user-circle-o" size={24} color="black" />, path: "/pages/Home" },
  ];

  // 네비게이션 아이템 클릭 핸들러
  const handleNavigation = (path: string) => {
    router.push(path as any);
  };

  return (
    <View style={styles.NavBarContainer}>
      <View style={styles.NavBar}>
        {navItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.NavBarIcon}
            onPress={() => handleNavigation(item.path)}
          >
            {item.icon}
            <Text style={styles.NavBarText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
