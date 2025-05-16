import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { styles as commonStyles } from "@/styles/ViewStyle";
import { LinearGradient } from 'expo-linear-gradient';
import Colors from "@/constants/Colors";
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * 여행 계획 결과 화면 컴포넌트
 * AI가 생성한 여행 계획을 표시합니다.
 */
export default function PlanResult() {
  const { plan, city } = useLocalSearchParams();
  const parsedPlan = plan ? JSON.parse(plan as string) : [];
  const router = useRouter();

  useEffect(() => {
    console.log("Raw plan param:", plan);
    console.log("Parsed plan:", parsedPlan);
  }, [plan]);

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
    if (!city) return 'Your';
    return city.toString().charAt(0).toUpperCase() + city.toString().slice(1);
  };

  // 새 계획 생성 버튼 핸들러
  const handleNewPlan = () => {
    router.back();
  };

  // 계획이 없는 경우
  if (!parsedPlan || parsedPlan.length === 0) {
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
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="exclamation-circle" size={50} color="#fff" />
                <Text style={styles.emptyTitle}>No Plan Data</Text>
                <Text style={styles.emptyMessage}>
                  We couldn't find any travel plan data. Please try creating a new plan.
                </Text>
                <TouchableOpacity
                  style={styles.newPlanButton}
                  onPress={handleNewPlan}
                >
                  <Text style={styles.newPlanButtonText}>Create New Plan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
  }

  // 여행 계획 카드 렌더링
  const renderCard = ({ item }: any) => {
    return (
      <View style={styles.card}>
        <Text style={styles.dayTitle}>Day {item["1. day"]}</Text>
        
        <View style={styles.timelineContainer}>
          <View style={styles.timelineEntry}>
            <View style={styles.timelineDot}>
              <FontAwesome5 name="sun" size={16} color="#fff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Morning</Text>
              <Text style={styles.timelineValue}>{item["2. morning"]}</Text>
            </View>
          </View>
          
          <View style={styles.timelineEntry}>
            <View style={[styles.timelineDot, { backgroundColor: Colors.light.accent }]}>
              <FontAwesome5 name="utensils" size={16} color="#fff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Lunch</Text>
              <Text style={styles.timelineValue}>{item["3. lunch"]}</Text>
            </View>
          </View>
          
          <View style={styles.timelineEntry}>
            <View style={[styles.timelineDot, { backgroundColor: Colors.light.secondary }]}>
              <FontAwesome5 name="walking" size={16} color="#fff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Afternoon</Text>
              <Text style={styles.timelineValue}>{item["4. afternoon"]}</Text>
            </View>
          </View>
          
          <View style={styles.timelineEntry}>
            <View style={[styles.timelineDot, { backgroundColor: Colors.light.tertiary }]}>
              <FontAwesome5 name="moon" size={16} color="#fff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Dinner</Text>
              <Text style={styles.timelineValue}>{item["5. dinner"]}</Text>
            </View>
          </View>
          
          <View style={styles.timelineEntry}>
            <View style={[styles.timelineDot, { backgroundColor: '#8E8E93' }]}>
              <FontAwesome5 name="bed" size={16} color="#fff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Stay</Text>
              <Text style={styles.timelineValue}>{item["6. stay"]}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

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
              <FontAwesome5 name="route" size={40} color="#fff" style={styles.headerIcon} />
              <Text style={styles.title}>
                {formatCityName()} Journey
              </Text>
              <Text style={styles.subtitle}>
                Your personalized travel itinerary
              </Text>
            </View>
            
            <FlatList
              data={parsedPlan}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderCard}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
            
            <TouchableOpacity
              style={styles.newPlanButton}
              onPress={handleNewPlan}
            >
              <FontAwesome5 name="redo-alt" size={16} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.newPlanButtonText}>Create New Plan</Text>
            </TouchableOpacity>
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
  listContainer: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  timelineContainer: {
    marginTop: 5,
  },
  timelineEntry: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.accent,
    marginBottom: 4,
  },
  timelineValue: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  newPlanButton: {
    backgroundColor: Colors.light.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    alignSelf: 'center',
    marginBottom: 20,
  },
  newPlanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
});
