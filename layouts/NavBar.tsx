import React from "react";
import { View, Text } from "react-native";
import { styles } from "@/styles/ViewStyle";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function NavBar() {
  return (
    <View style={styles.NavBarContainer}>
      <View style={styles.NavBar}>
        <View style={styles.NavBarIcon}>
          <Feather name="home" size={24} color="black" />
          <Text style={styles.NavBarText}>HOME</Text>
        </View>
        <View style={styles.NavBarIcon}>
          <MaterialIcons name="chat-bubble-outline" size={24} color="black" />
          <Text style={styles.NavBarText}>BOARD</Text>
        </View>
        <View style={styles.NavBarIcon}>
          <MaterialCommunityIcons name="chat-outline" size={24} color="black" />
          <Text style={styles.NavBarText}>CHAT</Text>
        </View>
        <View style={styles.NavBarIcon}>
          <FontAwesome name="user-circle-o" size={24} color="black" />
          <Text style={styles.NavBarText}>MY</Text>
        </View>
      </View>
    </View>
  );
}
