import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

export default function TripDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // 실제 구현에서는 API를 통해 여행 정보를 가져와야 합니다
  const tripData = {
    id: id,
    title: 'Jeju Island Adventure',
    date: 'Aug 15-20, 2023',
    image: require('@/assets/images/jeju.png'),
    status: 'upcoming',
    location: 'Jeju Island, South Korea',
    participants: [
      { id: '1', name: 'Alex', avatar: require('@/assets/images/profile.png') },
      { id: '2', name: 'Sarah', avatar: require('@/assets/images/profile.png') },
      { id: '3', name: 'Mike', avatar: require('@/assets/images/profile.png') }
    ],
    schedule: [
      {
        day: 1,
        date: 'Aug 15',
        activities: [
          { time: '09:00', title: '한라산 등반', location: '한라산 국립공원' },
          { time: '13:00', title: '점심 식사', location: '제주 흑돼지 맛집' },
          { time: '15:00', title: '성산일출봉 관광', location: '성산일출봉' }
        ]
      },
      {
        day: 2,
        date: 'Aug 16',
        activities: [
          { time: '10:00', title: '우도 투어', location: '우도' },
          { time: '14:00', title: '해녀 체험', location: '우도 해녀학교' },
          { time: '18:00', title: '저녁 식사', location: '제주 해산물 레스토랑' }
        ]
      }
    ]
  };

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    // 여행 계획 수정 페이지로 이동
  };

  const handleShare = () => {
    // 공유 기능 구현
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Image source={tripData.image} style={styles.coverImage} />
        
        <View style={styles.tripHeader}>
          <Text style={styles.tripTitle}>{tripData.title}</Text>
          <View style={styles.tripMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color={Colors.light.primary} />
              <Text style={styles.metaText}>{tripData.date}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color={Colors.light.primary} />
              <Text style={styles.metaText}>{tripData.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>참가자</Text>
          <View style={styles.participants}>
            {tripData.participants.map(participant => (
              <View key={participant.id} style={styles.participant}>
                <Image source={participant.avatar} style={styles.participantAvatar} />
                <Text style={styles.participantName}>{participant.name}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addParticipant}>
              <Ionicons name="add" size={24} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>일정</Text>
          {tripData.schedule.map(day => (
            <View key={day.day} style={styles.daySchedule}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>Day {day.day}</Text>
                <Text style={styles.dayDate}>{day.date}</Text>
              </View>
              {day.activities.map((activity, index) => (
                <View key={index} style={styles.activity}>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityLocation}>{activity.location}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>일정 수정</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: Colors.light.card,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  shareButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  tripHeader: {
    padding: 20,
    backgroundColor: Colors.light.card,
  },
  tripTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 10,
  },
  tripMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 5,
  },
  metaText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 15,
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participant: {
    alignItems: 'center',
    marginRight: 15,
  },
  participantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  participantName: {
    fontSize: 12,
    color: Colors.light.text,
  },
  addParticipant: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  daySchedule: {
    marginBottom: 20,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  dayDate: {
    fontSize: 14,
    color: '#666',
  },
  activity: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityTime: {
    width: 60,
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  activityLocation: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    padding: 20,
  },
  editButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 