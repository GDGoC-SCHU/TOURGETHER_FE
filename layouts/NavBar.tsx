import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "@/styles/ViewStyle";
import { useRouter, usePathname } from "expo-router";
import { Feather, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Colors from "@/constants/Colors";

/**
 * App Bottom Navigation Bar Component
 * Provides icon buttons to navigate to Home, Board, Chat, and My Page.
 * Styled to match the tabs navigation bar in design.
 */
export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Define navigation items
  const navItems = [
    { 
      name: "Home", 
      icon: (color: string, focused: boolean) => (
        <Feather name="compass" size={22} color={color} />
      ),
      path: "/(tabs)" 
    },
    { 
      name: "Board", 
      icon: (color: string, focused: boolean) => (
        <MaterialIcons name="explore" size={22} color={color} />
      ),
      path: "/(tabs)/board" 
    },
    { 
      name: "Chat", 
      icon: (color: string, focused: boolean) => (
        <MaterialCommunityIcons name="message-text-outline" size={22} color={color} />
      ),
      path: "/(tabs)/chat" 
    },
    { 
      name: "My Page", 
      icon: (color: string, focused: boolean) => (
        <FontAwesome5 name="user-alt" size={20} color={color} />
      ),
      path: "/(tabs)/mypage" 
    },
  ];

  // Navigation item click handler
  const handleNavigation = (path: string) => {
    router.push(path as any);
  };

  // Check if a path is active
  const isPathActive = (path: string) => {
    if (path === "/(tabs)" && pathname === "/") return true;
    
    // Special case for pages routes
    if (pathname?.startsWith("/pages/")) {
      return false; // Pages routes don't match any tab directly
    }
    
    return pathname?.includes(path);
  };

  return (
    <View style={[styles.NavBarContainer, { 
      backgroundColor: Colors.light.card,
      borderTopColor: Colors.light.border,
      borderTopWidth: 1,
      height: 65,
      paddingBottom: 8,
      paddingTop: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 8,
    }]}>
      <View style={styles.NavBar}>
        {navItems.map((item, index) => {
          const isActive = isPathActive(item.path);
          const iconColor = isActive ? Colors.light.accent : '#888';
          
          return (
            <TouchableOpacity 
              key={index} 
              style={[styles.NavBarIcon, { 
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
              }]}
              onPress={() => handleNavigation(item.path)}
            >
              {item.icon(iconColor, isActive)}
              <Text style={{
                color: isActive ? Colors.light.accent : '#888',
                fontSize: 11,
                fontWeight: '500',
              }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
