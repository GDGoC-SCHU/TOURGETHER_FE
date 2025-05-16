import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/layouts/Header';
import { useAuth } from '@/context/authContext';
import Colors from '@/constants/Colors';
import { FontAwesome5, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/**
 * 마이페이지 탭 화면 컴포넌트
 */
export default function MyPageScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const handleAccountSettings = () => {
    router.push('/pages/mypage/account');
  };

  const handleNotifications = () => {
    router.push('/pages/mypage/notifications');
  };

  const handlePrivacy = () => {
    router.push('/pages/mypage/privacy');
  };

  const handleHelp = () => {
    router.push('/pages/mypage/help');
  };

  const handleTripPress = (id: string) => {
    router.push({
      pathname: '/pages/mypage/trip/[id]',
      params: { id }
    });
  };

  // 여행 통계 데이터
  const travelStats = {
    visited: 8,
    planned: 3,
    reviews: 12,
    photos: 47
  };

  // 사용자 여행 계획
  const travelPlans = [
    {
      id: '1',
      destination: 'Jeju Island',
      date: 'Aug 15-20, 2023',
      image: require('@/assets/images/jeju.png')
    },
    {
      id: '2',
      destination: 'Busan',
      date: 'Oct 5-9, 2023',
      image: require('@/assets/images/busan.png')
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image
                source={require('@/assets/images/profile.png')}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.editProfileButton}>
                <Feather name="edit-2" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.username}>Alex Johnson</Text>
              <Text style={styles.userBio}>Adventure seeker | Travel enthusiast</Text>
              <View style={styles.locationContainer}>
                <Feather name="map-pin" size={14} color={Colors.light.primary} />
                <Text style={styles.locationText}>Seoul, South Korea</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{travelStats.visited}</Text>
              <Text style={styles.statLabel}>Visited</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{travelStats.planned}</Text>
              <Text style={styles.statLabel}>Planned</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{travelStats.reviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{travelStats.photos}</Text>
              <Text style={styles.statLabel}>Photos</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Upcoming Trips</Text>
          {travelPlans.map(plan => (
            <TouchableOpacity 
              key={plan.id} 
              style={styles.tripCard}
              onPress={() => handleTripPress(plan.id)}
            >
              <Image source={plan.image} style={styles.tripImage} />
              <View style={styles.tripInfo}>
                <Text style={styles.tripDestination}>{plan.destination}</Text>
                <Text style={styles.tripDate}>{plan.date}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#888" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleAccountSettings}>
            <View style={styles.menuIconContainer}>
              <FontAwesome5 name="user-alt" size={16} color="#fff" />
            </View>
            <Text style={styles.menuText}>Account Settings</Text>
            <Feather name="chevron-right" size={20} color="#888" style={styles.menuArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleNotifications}>
            <View style={[styles.menuIconContainer, { backgroundColor: Colors.light.secondary }]}>
              <Ionicons name="notifications-outline" size={18} color="#fff" />
            </View>
            <Text style={styles.menuText}>Notifications</Text>
            <Feather name="chevron-right" size={20} color="#888" style={styles.menuArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handlePrivacy}>
            <View style={[styles.menuIconContainer, { backgroundColor: Colors.light.tertiary }]}>
              <MaterialCommunityIcons name="shield-check-outline" size={18} color="#fff" />
            </View>
            <Text style={styles.menuText}>Privacy & Security</Text>
            <Feather name="chevron-right" size={20} color="#888" style={styles.menuArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleHelp}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#8E8E93' }]}>
              <Feather name="help-circle" size={18} color="#fff" />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
            <Feather name="chevron-right" size={20} color="#888" style={styles.menuArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={18} color={Colors.light.accent} style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  profileSection: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.light.primary,
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.accent,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.card,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.light.text,
  },
  userBio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.light.text,
  },
  tripCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tripImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  tripInfo: {
    flex: 1,
  },
  tripDestination: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.light.text,
  },
  tripDate: {
    fontSize: 12,
    color: '#666',
  },
  menuSection: {
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  menuArrow: {
    opacity: 0.5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 12,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.accent,
  },
}); 