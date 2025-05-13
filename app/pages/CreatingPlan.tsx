import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Calendar } from "react-native-calendars";
import NavBar from "@/layouts/NavBar";
import { useRouter } from "expo-router";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function CreatingPlan() {
  const { city } = useLocalSearchParams();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  //date select
  const handleDayPress = (day: { dateString: string }) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
      setSelectingEnd(true);
    } else if (selectingEnd && day.dateString > startDate) {
      setEndDate(day.dateString);
      setSelectingEnd(false);
    } else {
      setStartDate(day.dateString);
      setEndDate(null);
    }
  };

  // selected date marked
  const generateMarkedDates = () => {
    if (!startDate) return {};
    if (!endDate) {
      return {
        [startDate]: {
          selected: true,
          selectedColor: "#4f46e5",
        },
      };
    }

    const dates: { [key: string]: { selected: boolean; selectedColor: string } } = {};
    let current = new Date(startDate);
    const last = new Date(endDate);

    while (current <= last) {
        const day = current.getDate();
        const dateStr = current.toISOString().split("T")[0];
            dates[dateStr] = {
            selected: true,
            selectedColor: "#4f46e5",
        };
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const handleGeneratePlan = async () => {
    if (!startDate || !endDate) {
      alert("Please select both a start and end date.");
      return;
    }
    
    setIsLoading(true);
    try{
        const res = await fetch(`${BACKEND_URL}/api/plan`,{
            method: "POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({city, startDate, endDate})
        });
        const data = await res.json();
        console.log("받은 응답 : ",data);
        router.push({
            pathname:"/pages/PlanResult",
            params: {plan:JSON.stringify(data.plan ?? data)}
        });
    }catch(err){
        alert("failed to GeneratePlan");
    }finally{
        setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ marginTop: 15 }}>Generating your travel plan...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
        <Text
          style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" }}
        >
          Destination: {city}
        </Text>
        <Text
          style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" }}
        >
          Select date for your trip
        </Text>

        <Calendar
          onDayPress={handleDayPress}
          markedDates={generateMarkedDates()}
        />

        <TouchableOpacity
          onPress={handleGeneratePlan}
          style={{
            backgroundColor: "#4f46e5",
            padding: 15,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Generate AI Plan</Text>
        </TouchableOpacity>

        <NavBar />
      </View>
    </SafeAreaView>
  );
}
