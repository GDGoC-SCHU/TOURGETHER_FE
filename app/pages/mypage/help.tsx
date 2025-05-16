import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

export default function HelpSupport() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    router.back();
  };

  const faqCategories = [
    {
      id: '1',
      title: '계정 관리',
      icon: 'account-circle',
      questions: ['비밀번호를 변경하고 싶어요', '계정을 삭제하고 싶어요', '프로필 사진을 변경하고 싶어요']
    },
    {
      id: '2',
      title: '여행 계획',
      icon: 'map-marker',
      questions: ['여행 계획을 어떻게 만드나요?', '여행 일정을 수정하고 싶어요', '여행지 추천을 받고 싶어요']
    },
    {
      id: '3',
      title: '채팅 & 커뮤니티',
      icon: 'chat',
      questions: ['메시지를 보낼 수 없어요', '채팅방을 나가고 싶어요', '부적절한 사용자를 신고하고 싶어요']
    },
    {
      id: '4',
      title: '결제 & 환불',
      icon: 'credit-card',
      questions: ['결제 방법을 변경하고 싶어요', '환불을 요청하고 싶어요', '영수증을 받고 싶어요']
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="무엇을 도와드릴까요?"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>자주 묻는 질문</Text>
          {faqCategories.map(category => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <View style={[styles.categoryIcon, { backgroundColor: Colors.light.primary }]}>
                <MaterialCommunityIcons name={category.icon} size={24} color="#fff" />
              </View>
              <View style={styles.categoryContent}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.questionCount}>{category.questions.length}개의 질문</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>문의하기</Text>
          
          <TouchableOpacity style={styles.contactCard}>
            <View style={[styles.contactIcon, { backgroundColor: Colors.light.accent }]}>
              <MaterialCommunityIcons name="chat-processing" size={24} color="#fff" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>실시간 채팅</Text>
              <Text style={styles.contactDescription}>상담원과 실시간으로 대화하세요</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard}>
            <View style={[styles.contactIcon, { backgroundColor: Colors.light.secondary }]}>
              <MaterialCommunityIcons name="email-outline" size={24} color="#fff" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>이메일 문의</Text>
              <Text style={styles.contactDescription}>24시간 내에 답변해드립니다</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard}>
            <View style={[styles.contactIcon, { backgroundColor: Colors.light.tertiary }]}>
              <FontAwesome5 name="phone-alt" size={20} color="#fff" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>전화 상담</Text>
              <Text style={styles.contactDescription}>평일 09:00 - 18:00</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>유용한 링크</Text>
          
          <TouchableOpacity style={styles.linkItem}>
            <Text style={styles.linkText}>이용약관</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem}>
            <Text style={styles.linkText}>개인정보 처리방침</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem}>
            <Text style={styles.linkText}>커뮤니티 가이드라인</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
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
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 15,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  questionCount: {
    fontSize: 12,
    color: '#666',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 12,
    color: '#666',
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  linkText: {
    fontSize: 16,
    color: Colors.light.text,
  },
}); 