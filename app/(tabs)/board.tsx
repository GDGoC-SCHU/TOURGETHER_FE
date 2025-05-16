import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '@/layouts/Header';
import Colors from '@/constants/Colors';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import useBoard from '@/app/hooks/useBoard';

/**
 * 게시판 목록 화면 컴포넌트
 */
export default function BoardScreen() {
  const { posts, filterPosts, createNewPost } = useBoard();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('popular');
  
  // 필터링된 게시글 조회
  const filteredPosts = filterPosts(searchQuery, activeTab);
  
  // 게시글 클릭 핸들러
  const handlePostPress = (id: string) => {
    router.push({
      pathname: '/pages/board/[id]',
      params: { id }
    });
  };
  
  // 탭 변경 핸들러
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // 새 게시글 작성 핸들러
  const handleNewPost = () => {
    createNewPost();
  };

  // 게시글 렌더링 함수
  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.postCard} onPress={() => handlePostPress(item.id)}>
      <Image source={item.image} style={styles.postImage} />
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <View style={styles.postMeta}>
          <Text style={styles.postAuthor}>by {item.author}</Text>
          <Text style={styles.postDate}>{item.date}</Text>
        </View>
        
        {item.tags && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag: string, index: number) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.postStats}>
          <View style={styles.statItem}>
            <FontAwesome5 name="heart" size={14} color={Colors.light.accent} />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome5 name="comment" size={14} color={Colors.light.primary} />
            <Text style={styles.statText}>{item.comments}</Text>
          </View>
          {item.location && (
            <View style={styles.statItem}>
              <FontAwesome5 name="map-marker-alt" size={14} color="#888" />
              <Text style={styles.statText}>{item.location}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Travel Board</Text>
          <TouchableOpacity style={styles.newPostButton} onPress={handleNewPost}>
            <Feather name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search posts, topics, or users"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'popular' && styles.activeTab]}
            onPress={() => handleTabChange('popular')}
          >
            <Text style={[styles.tabText, activeTab === 'popular' && styles.activeTabText]}>Popular</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
            onPress={() => handleTabChange('recent')}
          >
            <Text style={[styles.tabText, activeTab === 'recent' && styles.activeTabText]}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'following' && styles.activeTab]}
            onPress={() => handleTabChange('following')}
          >
            <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>Following</Text>
          </TouchableOpacity>
        </View>
        
        {filteredPosts.length > 0 ? (
          <FlatList
            data={filteredPosts}
            renderItem={renderPost}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="inbox" size={50} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery 
                ? `No posts matching "${searchQuery}"` 
                : activeTab === 'following' 
                  ? "You're not following anyone yet"
                  : "No posts available"}
            </Text>
          </View>
        )}
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  newPostButton: {
    backgroundColor: Colors.light.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: Colors.light.text,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 25,
    backgroundColor: Colors.light.card,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  postCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.light.text,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  postAuthor: {
    fontSize: 13,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  postDate: {
    fontSize: 13,
    color: '#888',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: 'rgba(74, 137, 220, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: Colors.light.primary,
  },
  postStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  statText: {
    fontSize: 13,
    color: '#888',
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
}); 