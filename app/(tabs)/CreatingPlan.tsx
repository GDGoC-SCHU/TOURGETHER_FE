import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import Colors from "@/constants/Colors";
import { FontAwesome5 } from '@expo/vector-icons';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

/**
 * 여행 계획 생성 화면 컴포넌트
 * 여행 날짜를 선택하고 AI 계획을 생성합니다.
 */
export default function CreatingPlan() {
  const { city } = useLocalSearchParams();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 도시별 배경 이미지 매핑
  const getCityImage = () => {
    switch(city) {
      case 'seoul':
        return require('@/assets/images/seoul.png');
      case 'busan':
        return require('@/assets/images/busan.png');
      case 'jeju':
        return require('@/assets/images/jeju.png');
      case 'gyeongju':
        return require('@/assets/images/gyeongju.png');
      case 'yeosu':
        return require('@/assets/images/yeosu.png');
      case 'yongin':
        return require('@/assets/images/yongin.png');
      default:
        return require('@/assets/images/jeju.png');
    }
  };

  // 도시 이름 포맷팅
  const formatCityName = () => {
    if (!city) return '';
    return city.toString().charAt(0).toUpperCase() + city.toString().slice(1);
  };

  // 날짜 선택 핸들러
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

  // 선택된 날짜 표시
  const generateMarkedDates = () => {
    if (!startDate) return {};
    if (!endDate) {
      return {
        [startDate]: {
          selected: true,
          selectedColor: Colors.light.accent,
          startingDay: true,
          endingDay: true,
        },
      };
    }

    const dates: { [key: string]: any } = {};
    let current = new Date(startDate);
    const last = new Date(endDate);

    while (current <= last) {
      const dateStr = current.toISOString().split("T")[0];
      
      if (dateStr === startDate) {
        dates[dateStr] = {
          selected: true,
          selectedColor: Colors.light.accent,
          startingDay: true,
        };
      } else if (dateStr === endDate) {
        dates[dateStr] = {
          selected: true,
          selectedColor: Colors.light.accent,
          endingDay: true,
        };
      } else {
        dates[dateStr] = {
          selected: true,
          selectedColor: Colors.light.accent,
        };
      }
      
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  // AI 계획 생성 핸들러
  const handleGeneratePlan = async () => {
    if (!startDate || !endDate) {
      alert("Please select both a start and end date for your trip.");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/plan`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({city, startDate, endDate})
      });
      const data = await res.json();
      console.log("Received response:", data);
      router.push({
        pathname: "/(tabs)/PlanResult",
        params: {plan: JSON.stringify(data.plan ?? data)}
      });
    } catch (err) {
      alert("Failed to generate travel plan. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // 로딩 화면
  if (isLoading) {
    return (
      <ImageBackground
        source={getCityImage()}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}
          style={styles.loadingOverlay}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.accent} />
            <Text style={styles.loadingText}>Creating your perfect {formatCityName()} itinerary...</Text>
            <Text style={styles.loadingSubtext}>This may take a moment as our AI crafts your personalized travel plan</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={getCityImage()}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.header}>
              <FontAwesome5 name="map-marked-alt" size={40} color="#fff" style={styles.headerIcon} />
              <Text style={styles.title}>
                {formatCityName()} Adventure
              </Text>
              <Text style={styles.subtitle}>
                Select your travel dates
              </Text>
            </View>

            <View style={styles.calendarCard}>
              <View style={styles.dateInfo}>
                {startDate && (
                  <View style={styles.dateBox}>
                    <Text style={styles.dateLabel}>START</Text>
                    <Text style={styles.dateValue}>{startDate}</Text>
                  </View>
                )}
                {endDate && (
                  <View style={styles.dateBox}>
                    <Text style={styles.dateLabel}>END</Text>
                    <Text style={styles.dateValue}>{endDate}</Text>
                  </View>
                )}
                {!startDate && !endDate && (
                  <Text style={styles.datePrompt}>Tap to select dates</Text>
                )}
              </View>

              <Calendar
                onDayPress={handleDayPress}
                markedDates={generateMarkedDates()}
                theme={{
                  calendarBackground: '#fff',
                  textSectionTitleColor: '#666',
                  selectedDayBackgroundColor: Colors.light.accent,
                  selectedDayTextColor: '#fff',
                  todayTextColor: Colors.light.primary,
                  dayTextColor: '#333',
                  textDisabledColor: '#d9e1e8',
                  dotColor: Colors.light.accent,
                  arrowColor: Colors.light.accent,
                  monthTextColor: Colors.light.text,
                  indicatorColor: Colors.light.accent,
                }}
              />

              <TouchableOpacity
                onPress={handleGeneratePlan}
                style={[
                  styles.generateButton,
                  (!startDate || !endDate) && styles.buttonDisabled
                ]}
                disabled={!startDate || !endDate}
              >
                <FontAwesome5 name="magic" size={16} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.generateButtonText}>Generate AI Travel Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  calendarCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  dateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dateBox: {
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 14,
    color: Colors.light.accent,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  datePrompt: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
  generateButton: {
    backgroundColor: Colors.light.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0.1,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
});
