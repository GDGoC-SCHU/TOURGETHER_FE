import React from "react"
import { View, Image, Text, TouchableOpacity } from "react-native"
import { SimpleLineIcons } from "@expo/vector-icons"
import { styles } from "@/styles/ViewStyle"
import { useRouter } from "expo-router"

/**
 * 앱 상단 헤더 컴포넌트
 * 로고와 알림 아이콘을 표시합니다.
 */
export default function Header() {
    const router = useRouter()
    
    // 알림 페이지로 이동
    const handleNotification = () => {
        router.push("/pages/Notifications" as any)
    }
    
    // 홈으로 이동
    const handleGoHome = () => {
        router.push("/(tabs)" as any)
    }
    
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleGoHome}>
                <Image
                    source={require("@/assets/images/logo.png")}
                    style={{ width: 40, height: 55, marginTop: 20, marginLeft: 10 }}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon} onPress={handleNotification}>
                <SimpleLineIcons name="bell" size={24} color="black" />
            </TouchableOpacity>
        </View>
    )
}
