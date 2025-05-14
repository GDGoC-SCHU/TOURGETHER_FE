import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import {useRouter} from 'expo-router';
import {AuthProvider, useAuth} from '@/context/authContext'; // 경로 확인 필요

// 실제 컨텐츠 컴포넌트
function TabContent() {
  const {userId, logout} = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      console.log('로그아웃 시작...');
      await logout();
      console.log('로그아웃 완료, 화면 전환 준비...');
      
      // 약간의 지연을 주어 상태가 완전히 업데이트되도록 함
      setTimeout(() => {
        // 웹 환경에서는 직접 로그인 페이지로 이동
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.location.href = '/auth/LoginScreen';
        } else {
          // 모바일 환경에서는 router 사용
          router.replace('/auth/LoginScreen');
        }
      }, 300);
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tourgether</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <View style={[styles.profileImage, {
            backgroundColor: '#ddd',
            justifyContent: 'center',
            alignItems: 'center'
          }]}>
            <Text>프로필</Text>
          </View>
          <Text style={styles.welcomeText}>
            환영합니다! #{userId}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>나의 여행</Text>
          <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>새 여행 계획하기</Text>
              <Text style={styles.cardDescription}>
                새로운 여행을 계획하고 친구들과 공유하세요.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>진행 중인 여행</Text>
              <Text style={styles.cardDescription}>
                현재 진행 중인 여행을 확인하세요.
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>인기 여행지</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
                      style={styles.horizontalScroll}>
            <TouchableOpacity style={styles.destinationCard}>
              <View style={[styles.destinationImage, {
                backgroundColor: '#ddd',
                justifyContent: 'center',
                alignItems: 'center'
              }]}>
                <Text>제주도</Text>
              </View>
              <Text style={styles.destinationTitle}>제주도</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.destinationCard}>
              <View style={[styles.destinationImage, {
                backgroundColor: '#ddd',
                justifyContent: 'center',
                alignItems: 'center'
              }]}>
                <Text>부산</Text>
              </View>
              <Text style={styles.destinationTitle}>부산</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.destinationCard}>
              <View style={[styles.destinationImage, {
                backgroundColor: '#ddd',
                justifyContent: 'center',
                alignItems: 'center'
              }]}>
                <Text>강릉</Text>
              </View>
              <Text style={styles.destinationTitle}>강릉</Text>
            </TouchableOpacity>
          </ScrollView>

          <Text style={styles.sectionTitle}>추천 여행 코스</Text>
          <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.recommendCard}>
              <Text style={styles.cardTitle}>서울 3일 코스</Text>
              <Text style={styles.cardDescription}>
                서울의 핵심 명소를 3일동안 효율적으로 둘러보는 코스
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recommendCard}>
              <Text style={styles.cardTitle}>부산 힐링 여행</Text>
              <Text style={styles.cardDescription}>
                부산의 바다와 산을 즐기는 휴양 중심 코스
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
  );
}

// 메인 컴포넌트
export default function Index() {
  return (
      <AuthProvider>
        <TabContent/>
      </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#3897f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
    color: '#333',
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  destinationCard: {
    width: 160,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  destinationImage: {
    width: 160,
    height: 120,
  },
  destinationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    color: '#333',
  },
});