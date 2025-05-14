import React from "react"
import { View,Image,Text } from "react-native"
import { SimpleLineIcons } from "@expo/vector-icons"
import { styles } from "@/styles/ViewStyle"

export default function Header(){
    return(
        <View style={styles.headerContainer}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={{ width: 40, height: 55, marginTop: 20, marginLeft: 10 }}
      />
      <View style={styles.headerIcon}>
        <SimpleLineIcons name="bell" size={24} color="black" />
      </View>
    </View> );
}
