import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Dimensions, ImageBackground } from "react-native";
import { useRouter } from 'expo-router';
import Carousel from "react-native-reanimated-carousel";
import Header from "@/layouts/Header";
import { styles } from "@/styles/ViewStyle";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import Colors from "@/constants/Colors";

const { width: screenWidth } = Dimensions.get('window');

/**
 * 메인 홈 화면 컴포넌트
 * 여행 감성을 강화한 디자인으로 개선
 */
export default function HomeScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 도시 데이터
  const cities = [
    { 
      name: 'seoul', 
      image: require('@/assets/images/seoul.png'),
      title: 'Seoul',
      description: 'Where history meets modernity'
    },
    { 
      name: 'busan', 
      image: require('@/assets/images/busan.png'),
      title: 'Busan',
      description: 'Coastal city with mountains and beaches'
    },
    { 
      name: 'jeju', 
      image: require('@/assets/images/jeju.png'),
      title: 'Jeju',
      description: 'Island filled with natural wonders'
    },
    { 
      name: 'gyeongju', 
      image: require('@/assets/images/gyeongju.png'),
      title: 'Gyeongju',
      description: 'City with thousand years of history'
    },
    { 
      name: 'yeosu', 
      image: require('@/assets/images/yeosu.png'),
      title: 'Yeosu',
      description: 'Beautiful night sea views'
    },
    { 
      name: 'yongin', 
      image: require('@/assets/images/yongin.png'),
      title: 'Yongin',
      description: 'Home to exciting theme parks'
    },
  ];

  // 추천 여행 테마
  const travelThemes = [
    { id: 1, name: 'Nature', icon: 'tree' },
    { id: 2, name: 'Culture', icon: 'landmark' },
    { id: 3, name: 'Food', icon: 'utensils' },
    { id: 4, name: 'Adventure', icon: 'mountain' },
    { id: 5, name: 'Relaxation', icon: 'umbrella-beach' },
  ];

  // 투어 이미지 데이터
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
      description: 'Beautiful scenery and delicious seafood'
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
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <Header />
      <View style={{ flex: 1, paddingTop: 100 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {/* 검색 바 */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#888" />
            <TextInput
              placeholder="Where would you like to go?"
              style={styles.searchInput}
              placeholderTextColor="#888"
            />
          </View>
          
          {/* 추천 여행 */}
          <View style={{ padding: 20 }}>
            <Text style={{ 
              fontSize: 24, 
              fontWeight: 'bold', 
              marginBottom: 20,
              color: Colors.light.text
            }}>
              Journeys Just For You
            </Text>
            
            <Carousel
              width={screenWidth - 40}
              height={220}
              data={tourImages}
              loop
              autoPlay
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => setCurrentIndex(index)}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.destinationCard}
                  onPress={() => handleCitySelect(item.id === 1 ? 'seoul' : 'busan')}
                >
                  <ImageBackground
                    source={item.image}
                    style={styles.destinationImage}
                    imageStyle={{ borderRadius: 16 }}
                  >
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '60%',
                        borderBottomLeftRadius: 16,
                        borderBottomRightRadius: 16,
                      }}
                    />
                    <View style={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0,
                      padding: 20,
                    }}>
                      <Text style={styles.destinationName}>{item.title}</Text>
                      <Text style={styles.destinationDescription}>{item.description}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              )}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
              {tourImages.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginHorizontal: 4,
                    backgroundColor: index === currentIndex ? Colors.light.accent : '#ccc',
                  }}
                />
              ))}
            </View>
          </View>
          
          {/* 여행 테마 */}
          <View style={{ padding: 20 }}>
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              marginBottom: 15,
              color: Colors.light.text
            }}>
              What Type of Journey?
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              {travelThemes.map((theme) => (
                <TouchableOpacity
                  key={theme.id}
                  style={{
                    alignItems: 'center',
                    width: '18%',
                  }}
                >
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: Colors.light.primary + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: Colors.light.primary + '40',
                  }}>
                    <FontAwesome5 name={theme.icon} size={20} color={Colors.light.primary} />
                  </View>
                  <Text style={{ fontSize: 12, color: Colors.light.text }}>{theme.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 인기 도시 */}
          <View style={{ padding: 20 }}>
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              marginBottom: 15,
              color: Colors.light.text
            }}>
              Popular Destinations
            </Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {cities.map(({ name, image, title, description }) => (
                <TouchableOpacity
                  key={name}
                  onPress={() => handleCitySelect(name)}
                  style={{
                    width: '48%',
                    marginBottom: 15,
                    borderRadius: 12,
                    overflow: 'hidden',
                    backgroundColor: Colors.light.card,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3,
                  }}
                >
                  <Image source={image} style={{ width: '100%', height: 100 }} />
                  <View style={{ padding: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>{title}</Text>
                    <Text style={{ fontSize: 12, color: '#666', height: 32 }}>{description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Explore More Destinations</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
