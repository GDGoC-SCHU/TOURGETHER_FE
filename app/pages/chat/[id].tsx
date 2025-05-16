import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import useChat, { Message } from '@/app/hooks/useChat';

/**
 * 채팅방 상세 화면 컴포넌트
 */
export default function ChatDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { chatRooms, getChatMessages, sendMessage, markChatAsRead } = useChat();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);
  
  // 채팅방 ID
  const chatId = Array.isArray(id) ? id[0] : id;
  
  // 현재 채팅방 정보
  const currentChat = chatRooms[chatId];
  
  // 메시지 불러오기
  useEffect(() => {
    if (chatId) {
      // 채팅 메시지 가져오기
      const chatMessages = getChatMessages(chatId);
      setMessages(chatMessages);
      
      // 읽지 않은 메시지 표시 지우기
      markChatAsRead(chatId);
    }
  }, [chatId]);
  
  // 메시지 전송 핸들러
  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    
    // 새 메시지 전송
    try {
      const newMessage = await sendMessage(chatId, message);
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // 자동 응답 시뮬레이션
      setTimeout(() => {
        setIsTyping(true);
        
        setTimeout(() => {
          setIsTyping(false);
          const responseMessage: Message = {
            id: Date.now().toString(),
            text: `Thanks for your message! This is an automated response from ${currentChat.name}.`,
            sender: 'other',
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            read: false
          };
          setMessages(prev => [...prev, responseMessage]);
        }, 2000);
      }, 1000);
    } catch (err) {
      console.error('메시지 전송 실패:', err);
    }
  };
  
  // 뒤로가기 핸들러
  const handleBack = () => {
    router.back();
  };
  
  // 새 메시지가 추가될 때 스크롤 자동 이동
  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  
  // 메시지 렌더링 함수
  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
      <View style={[styles.messageBubble, item.sender === 'me' ? styles.myMessageBubble : styles.otherMessageBubble]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
      <View style={styles.messageFooter}>
        <Text style={styles.messageTime}>{item.timestamp}</Text>
        {item.sender === 'me' && (
          <Ionicons 
            name={item.read ? "checkmark-done" : "checkmark"} 
            size={16} 
            color={item.read ? Colors.light.accent : "#888"} 
            style={{ marginLeft: 5 }}
          />
        )}
      </View>
    </View>
  );
  
  // 채팅방이 없는 경우
  if (!currentChat) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chat</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.notFoundContainer}>
          <FontAwesome name="comments-o" size={50} color="#ccc" />
          <Text style={styles.notFoundText}>Chat not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {/* 채팅방 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={Colors.light.text} />
        </TouchableOpacity>
        
        <View style={styles.chatInfo}>
          <View style={styles.avatarContainer}>
            <Image source={currentChat.avatar} style={styles.avatar} />
            {currentChat.isOnline && <View style={styles.onlineIndicator} />}
          </View>
          <View>
            <Text style={styles.chatName}>{currentChat.name}</Text>
            <Text style={styles.chatStatus}>
              {currentChat.members 
                ? `${currentChat.members} members · ${currentChat.lastActive}`
                : currentChat.lastActive}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="call-outline" size={22} color={Colors.light.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={22} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* 메시지 목록 */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />
      
      {/* 타이핑 표시 */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.typingBubble}>
            <View style={styles.typingDot} />
            <View style={[styles.typingDot, { marginLeft: 4 }]} />
            <View style={[styles.typingDot, { marginLeft: 4 }]} />
          </View>
        </View>
      )}
      
      {/* 메시지 입력 영역 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={styles.inputContainer}
      >
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="add-circle-outline" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
          placeholderTextColor="#888"
        />
        
        {message.trim() !== '' ? (
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.voiceContainer}>
            <TouchableOpacity style={styles.voiceButton}>
              <FontAwesome name="microphone" size={20} color={Colors.light.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera-outline" size={24} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
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
  chatInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.tertiary,
    borderWidth: 2,
    borderColor: Colors.light.card,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  chatStatus: {
    fontSize: 12,
    color: '#888',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 5,
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
  messagesList: {
    padding: 15,
    paddingTop: 10,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  myMessageBubble: {
    backgroundColor: Colors.light.accent,
    borderBottomRightRadius: 5,
  },
  otherMessageBubble: {
    backgroundColor: Colors.light.card,
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 21,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 5,
  },
  messageTime: {
    fontSize: 11,
    color: '#888',
  },
  typingContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderBottomLeftRadius: 5,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#888',
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: Colors.light.card,
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    minHeight: 40,
    fontSize: 15,
  },
  voiceContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  voiceButton: {
    padding: 8,
  },
  cameraButton: {
    padding: 8,
  },
  sendButton: {
    backgroundColor: Colors.light.accent,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
}); 