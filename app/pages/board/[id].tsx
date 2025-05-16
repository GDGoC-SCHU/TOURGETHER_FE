import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import useBoard from '@/app/hooks/useBoard';
import Colors from '@/constants/Colors';
import { Comment, Post } from '@/app/hooks/useBoard';

/**
 * 게시판 상세 페이지 컴포넌트
 */
export default function BoardDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getPostDetails, getComments, addComment, likePost } = useBoard();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  
  // 게시글 및 댓글 불러오기
  useEffect(() => {
    if (id) {
      const postId = Array.isArray(id) ? id[0] : id;
      const postDetails = getPostDetails(postId);
      setPost(postDetails);
      
      const postComments = getComments(postId);
      setComments(postComments);
    }
  }, [id]);
  
  // 댓글 작성 핸들러
  const handleAddComment = async () => {
    if (!id || !newComment.trim()) return;
    
    const postId = Array.isArray(id) ? id[0] : id;
    setIsSubmitting(true);
    
    try {
      const comment = await addComment(postId, newComment);
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 좋아요 핸들러
  const handleLike = () => {
    if (!id || liked) return;
    
    const postId = Array.isArray(id) ? id[0] : id;
    likePost(postId);
    setLiked(true);
    
    if (post) {
      setPost({
        ...post,
        likes: post.likes + 1
      });
    }
  };
  
  // 뒤로가기 핸들러
  const handleBack = () => {
    router.back();
  };
  
  // 댓글 렌더링 함수
  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image source={item.avatar} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>{item.author}</Text>
          <Text style={styles.commentDate}>{item.date}</Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.commentAction}>
            <FontAwesome5 name="heart" size={12} color="#999" />
            <Text style={styles.actionText}>{item.likes > 0 ? item.likes : 'Like'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentAction}>
            <FontAwesome5 name="reply" size={12} color="#999" />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
  // 게시글이 없는 경우
  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post Details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.notFoundContainer}>
          <FontAwesome5 name="exclamation-circle" size={50} color="#ccc" />
          <Text style={styles.notFoundText}>Post not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post Details</Text>
          <TouchableOpacity style={styles.headerRight}>
            <Ionicons name="share-outline" size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <>
              <View style={styles.postContainer}>
                <Image source={post.image} style={styles.postImage} />
                <View style={styles.postContent}>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  
                  <View style={styles.postMeta}>
                    <View style={styles.authorContainer}>
                      <FontAwesome5 name="user-circle" size={20} color={Colors.light.primary} />
                      <Text style={styles.postAuthor}>{post.author}</Text>
                    </View>
                    <Text style={styles.postDate}>{post.date}</Text>
                  </View>
                  
                  {post.tags && (
                    <View style={styles.tagsContainer}>
                      {post.tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>#{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  
                  {post.location && (
                    <View style={styles.locationContainer}>
                      <FontAwesome5 name="map-marker-alt" size={14} color="#666" />
                      <Text style={styles.locationText}>{post.location}</Text>
                    </View>
                  )}
                  
                  <Text style={styles.postContent}>{post.content}</Text>
                  
                  <View style={styles.postStats}>
                    <TouchableOpacity
                      style={[styles.statButton, liked && styles.likedButton]}
                      onPress={handleLike}
                    >
                      <FontAwesome5 
                        name={liked ? "heart" : "heart"} 
                        solid={liked}
                        size={16} 
                        color={liked ? "#fff" : Colors.light.accent} 
                      />
                      <Text 
                        style={[styles.statButtonText, liked && styles.likedButtonText]}
                      >
                        {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
                      </Text>
                    </TouchableOpacity>
                    
                    <View style={styles.statIndicator}>
                      <FontAwesome5 name="comment" size={16} color={Colors.light.primary} />
                      <Text style={styles.statText}>
                        {post.comments} {post.comments === 1 ? 'Comment' : 'Comments'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <View style={styles.commentsHeader}>
                <Text style={styles.commentsTitle}>Comments</Text>
                <View style={styles.commentsSeparator} />
              </View>
            </>
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
          contentContainerStyle={styles.commentsList}
          showsVerticalScrollIndicator={false}
        />
        
        <View style={styles.commentInputContainer}>
          <Image source={require('@/assets/images/profile.png')} style={styles.inputAvatar} />
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            placeholderTextColor="#999"
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, (!newComment.trim() || isSubmitting) && styles.sendButtonDisabled]}
            onPress={handleAddComment}
            disabled={!newComment.trim() || isSubmitting}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={(!newComment.trim() || isSubmitting) ? "#ccc" : Colors.light.accent} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardAvoid: {
    flex: 1,
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
    alignItems: 'flex-end',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: '#666',
    marginTop: 12,
  },
  postContainer: {
    backgroundColor: Colors.light.card,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAuthor: {
    fontSize: 15,
    color: Colors.light.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  postDate: {
    fontSize: 14,
    color: '#888',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginTop: 12,
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 137, 220, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  likedButton: {
    backgroundColor: Colors.light.accent,
  },
  statButtonText: {
    fontSize: 14,
    color: Colors.light.accent,
    fontWeight: '500',
    marginLeft: 8,
  },
  likedButtonText: {
    color: '#fff',
  },
  statIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  commentsHeader: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  commentsSeparator: {
    height: 1,
    backgroundColor: '#eee',
  },
  commentsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 12,
    borderTopLeftRadius: 4,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  commentDate: {
    fontSize: 12,
    color: '#888',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: Colors.light.card,
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 80,
    fontSize: 14,
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
}); 