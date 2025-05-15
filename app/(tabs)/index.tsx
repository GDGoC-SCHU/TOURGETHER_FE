import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Dimensions } from "react-native";
import { useRouter } from 'expo-router';
import Carousel from "react-native-reanimated-carousel";
import Header from "@/layouts/Header";
import { styles } from "@/styles/ViewStyle";

const { width: screenWidth } = Dimensions.get('window');

/**
 * 메인 홈 화면 컴포넌트
 */
export default function HomeScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 도시 데이터
  const cities = [
    { name: 'seoul', image: require('@/assets/images/seoul.png') },
    { name: 'busan', image: require('@/assets/images/busan.png') },
    { name: 'jeju', image: require('@/assets/images/jeju.png') },
    { name: 'gyeongju', image: require('@/assets/images/gyeongju.png') },
    { name: 'yeosu', image: require('@/assets/images/yeosu.png') },
    { name: 'yongin', image: require('@/assets/images/yongin.png') },
  ];

  // 투어 이미지 데이터
  const tourImages = [
    { id: 1, image: require('@/assets/images/seoul.png') },
    { id: 2, image: require('@/assets/images/busan.png') },
  ];

  // 도시 선택 핸들러
  const handleCitySelect = (city: string) => {
    router.push({
      pathname: "/pages/CreatingPlan",
      params: { city }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Header />
      <View style={{ flex: 1, paddingTop: 100 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
              이런 여행은 어떠세요?
            </Text>
            
            <Carousel
              width={screenWidth}
              height={200}
              data={tourImages}
              loop
              autoPlay
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => setCurrentIndex(index)}
              renderItem={({ item }) => (
                <Image
                  source={item.image}
                  style={{ width: screenWidth * 0.9, height: 200, borderRadius: 10, marginLeft: 20}}
                />
              )}
            />

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              {tourImages.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginHorizontal: 4,
                    backgroundColor: index === currentIndex ? '#333' : '#ccc',
                  }}
                />
              ))}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 20, width: '65%', borderBlockColor: "black" }}>
              <TextInput
                placeholder="더 많은 장소를 탐색해보세요!"
                style={{ borderWidth: 0.5, borderColor: '#ccc', borderRadius: 20, padding: 10, flex: 1, textAlign: "center" }}
                placeholderTextColor="grey"
              />
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {cities.map(({ name, image }) => (
                <TouchableOpacity
                  key={name}
                  onPress={() => handleCitySelect(name)}
                  style={{
                    width: '30%',
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 10,
                    marginBottom: 15,
                    alignItems: 'center',
                    padding: 10,
                  }}
                >
                  <Image source={image} style={{ width: 80, height: 60, borderRadius: 5 }} />
                  <Text style={{ marginTop: 5, fontSize: 12 }}># {name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
