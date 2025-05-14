import React, { useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { styles } from "@/styles/ViewStyle";

export default function PlanResult() {
  const { plan } = useLocalSearchParams();
  const parsedPlan = plan ? JSON.parse(plan as string) : [];

  useEffect(() => {
    console.log("Raw plan param:", plan);
    console.log("Parsed plan:", parsedPlan);
  }, [plan]);

  // parsedPlan이 없는 경우
  if (!parsedPlan || parsedPlan.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No plan data received.</Text>
      </View>
    );
  }

  //travel plan card
  const renderCard = ({ item }: any) => {
    return (
      <View style={styles.card}>
        <Text style={styles.day}>Day {item["1. day"]}</Text>
        <View style={styles.entry}><Text style={styles.label}>🕘 Morning:</Text><Text style={styles.value}>{item["2. morning"]}</Text></View>
        <View style={styles.entry}><Text style={styles.label}>🍽️ Lunch:</Text><Text style={styles.value}>{item["3. lunch"]}</Text></View>
        <View style={styles.entry}><Text style={styles.label}>☀️ Afternoon:</Text><Text style={styles.value}>{item["4. afternoon"]}</Text></View>
        <View style={styles.entry}><Text style={styles.label}>🌙 Dinner:</Text><Text style={styles.value}>{item["5. dinner"]}</Text></View>
        <View style={styles.entry}><Text style={styles.label}>🛏️ Stay:</Text><Text style={styles.value}>{item["6. stay"]}</Text></View>
      </View>
    );
  };

  return (
    <View style={styles.planContainer}>
      <Text style={styles.planTitle}>Recommended AI Course</Text>
      <FlatList
        data={parsedPlan}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>  );
}
