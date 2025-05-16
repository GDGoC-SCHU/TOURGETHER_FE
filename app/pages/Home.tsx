import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Dimensions, ImageBackground, StyleSheet } from "react-native";
import NavBar from "@/layouts/NavBar";
import Header from "@/layouts/Header";
import { useRouter } from 'expo-router';
import Carousel from "react-native-reanimated-carousel";
import { LinearGradient } from 'expo-linear-gradient';
import Colors from "@/constants/Colors";
import { FontAwesome5, Feather } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

/**
 * 홈 화면 컴포넌트
 * 여행 도시 선택 및 추천 여행지를 표시합니다.
 */
export default function Home() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 도시 데이터
  const cities = [
    { 
      name: 'seoul', 
      image: require('@/assets/images/seoul.png'),
      title: 'Seoul',
      description: 'Where tradition meets modernity'
    },
    { 
      name: 'busan', 
      image: require('@/assets/images/busan.png'),
      title: 'Busan',
      description: 'Coastal city with beautiful beaches'
    },
    { 
      name: 'jeju', 
      image: require('@/assets/images/jeju.png'),
      title: 'Jeju Island',
      description: 'Natural wonders and scenic views'
    },
    { 
      name: 'gyeongju', 
      image: require('@/assets/images/gyeongju.png'),
      title: 'Gyeongju',
      description: 'Ancient capital with rich history'
    },
    { 
      name: 'yeosu', 
      image: require('@/assets/images/yeosu.png'),
      title: 'Yeosu',
      description: 'Beautiful coastal landscapes'
    },
    { 
      name: 'yongin', 
      image: require('@/assets/images/yongin.png'),
      title: 'Yongin',
      description: 'Home to exciting theme parks'
    },
  ];

  // 추천 여행 이미지
  const tourImages = [
    { 
      id: 1, 
      image: require('@/assets/images/seoul.png'),
      title: 'Seoul City Tour',
      description: 'Explore historic sites and modern landmarks'
    },
    { 
      id: 2, 
      image: require('@/assets/images/busan.png'),
      title: 'Busan Coastal Journey',
      description: 'Beautiful beaches and seafood paradise'
    },
  ];

  // 도시 선택 핸들러
  const handleCitySelect = (city: string) => {
    router.push({
      pathname: "/(tabs)/CreatingPlan",
      params: { city }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Discover Your Next Adventure</Text>
          <Text style={styles.welcomeSubtitle}>Where would you like to explore?</Text>
        </View>

        {/* 검색 바 */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#888" />
          <TextInput
            placeholder="Search destinations..."
            style={styles.searchInput}
            placeholderTextColor="#888"
          />
        </View>

        {/* 추천 여행 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Featured Journeys</Text>
          
          <Carousel
            width={screenWidth - 40}
            height={200}
            data={tourImages}
            loop
            autoPlay
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => setCurrentIndex(index)}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.carouselItem}
                onPress={() => handleCitySelect(item.id === 1 ? 'seoul' : 'busan')}
              >
                <ImageBackground
                  source={item.image}
                  style={styles.carouselImage}
                  imageStyle={{ borderRadius: 16 }}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.carouselGradient}
                  >
                    <View style={styles.carouselContent}>
                      <Text style={styles.carouselTitle}>{item.title}</Text>
                      <Text style={styles.carouselDescription}>{item.description}</Text>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            )}
          />

          <View style={styles.indicatorContainer}>
            {tourImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentIndex && styles.indicatorActive
                ]}
              />
            ))}
          </View>
        </View>

        {/* 인기 도시 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          
          <View style={styles.citiesGrid}>
            {cities.map((city) => (
              <TouchableOpacity
                key={city.name}
                style={styles.cityCard}
                onPress={() => handleCitySelect(city.name)}
              >
                <Image source={city.image} style={styles.cityImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.cityGradient}
                >
                  <Text style={styles.cityName}>{city.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.exploreButton}>
            <Text style={styles.exploreButtonText}>Explore More</Text>
            <Feather name="arrow-right" size={16} color="#fff" style={{ marginLeft: 5 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <NavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
    marginTop: 80,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  welcomeSection: {
    padding: 20,
    paddingTop: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.light.text,
  },
  carouselItem: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  carouselContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  carouselTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  carouselDescription: {
    fontSize: 14,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: Colors.light.accent,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  citiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cityCard: {
    width: '48%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cityImage: {
    width: '100%',
    height: '100%',
  },
  cityGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  cityName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  exploreButton: {
    backgroundColor: Colors.light.accent,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    alignSelf: 'center',
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 