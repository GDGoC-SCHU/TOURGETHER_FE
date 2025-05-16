import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

// 채팅 타입 정의
export interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: any; // 이미지 리소스 타입
  isOnline: boolean;
  type: 'group' | 'direct';
  tags?: string[];
}

// 메시지 타입 정의
export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  read: boolean;
}

// 채팅방 정보 타입 정의
export interface ChatRoom {
  id: string;
  name: string;
  avatar: any;
  isOnline: boolean;
  members?: number;
  lastActive?: string;
  type: 'group' | 'direct';
  tags?: string[];
}

/**
 * 채팅 관련 기능을 관리하는 커스텀 훅
 */
const useChat = () => {
  const [chats, setChats] = useState<ChatItem[]>([
    {
      id: '1',
      name: 'Seoul Travel Group',
      lastMessage: 'Anyone want to join for dinner tonight?',
      time: '10:30 AM',
      unread: 3,
      avatar: require('@/assets/images/seoul.png'),
      isOnline: true,
      type: 'group',
      tags: ['seoul', 'travel']
    },
    {
      id: '2',
      name: 'Jeju Island Explorers',
      lastMessage: 'The weather forecast looks great for tomorrow!',
      time: 'Yesterday',
      unread: 0,
      avatar: require('@/assets/images/jeju.png'),
      isOnline: false,
      type: 'group',
      tags: ['jeju', 'travel']
    },
    {
      id: '3',
      name: 'Busan Beach Party',
      lastMessage: 'I shared the photos from our trip',
      time: '2 days ago',
      unread: 0,
      avatar: require('@/assets/images/busan.png'),
      isOnline: true,
      type: 'group',
      tags: ['busan', 'beach']
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      lastMessage: 'Thanks for the recommendations!',
      time: '3 days ago',
      unread: 0,
      avatar: require('@/assets/images/profile.png'),
      isOnline: false,
      type: 'direct'
    },
    {
      id: '5',
      name: 'David Kim',
      lastMessage: 'See you at the museum tomorrow!',
      time: '3 days ago',
      unread: 2,
      avatar: require('@/assets/images/profile.png'),
      isOnline: true,
      type: 'direct'
    },
    {
      id: '6',
      name: 'Gyeongju Historical Tour',
      lastMessage: 'Don\'t forget to bring comfortable shoes!',
      time: '4 days ago',
      unread: 0,
      avatar: require('@/assets/images/gyeongju.png'),
      isOnline: false,
      type: 'group',
      tags: ['gyeongju', 'history']
    },
    {
      id: '7',
      name: 'Yeosu Ocean Explorers',
      lastMessage: 'The cable car ride was amazing!',
      time: '5 days ago',
      unread: 0,
      avatar: require('@/assets/images/yeosu.png'),
      isOnline: false,
      type: 'group',
      tags: ['yeosu', 'ocean']
    },
  ]);

  // 채팅방 정보
  const chatRooms: { [key: string]: ChatRoom } = {
    '1': {
      id: '1',
      name: 'Seoul Travel Group',
      avatar: require('@/assets/images/seoul.png'),
      isOnline: true,
      members: 8,
      lastActive: '2 min ago',
      type: 'group',
      tags: ['seoul', 'travel']
    },
    '2': {
      id: '2',
      name: 'Jeju Island Explorers',
      avatar: require('@/assets/images/jeju.png'),
      isOnline: false,
      members: 12,
      lastActive: '1 hour ago',
      type: 'group',
      tags: ['jeju', 'travel']
    },
    '3': {
      id: '3',
      name: 'Busan Beach Party',
      avatar: require('@/assets/images/busan.png'),
      isOnline: true,
      members: 6,
      lastActive: 'Just now',
      type: 'group',
      tags: ['busan', 'beach']
    },
    '4': {
      id: '4',
      name: 'Sarah Johnson',
      avatar: require('@/assets/images/profile.png'),
      isOnline: false,
      lastActive: '3 hours ago',
      type: 'direct'
    },
    '5': {
      id: '5',
      name: 'David Kim',
      avatar: require('@/assets/images/profile.png'),
      isOnline: true,
      lastActive: 'Just now',
      type: 'direct'
    },
    '6': {
      id: '6',
      name: 'Gyeongju Historical Tour',
      avatar: require('@/assets/images/gyeongju.png'),
      isOnline: false,
      members: 15,
      lastActive: '4 days ago',
      type: 'group',
      tags: ['gyeongju', 'history']
    },
    '7': {
      id: '7',
      name: 'Yeosu Ocean Explorers',
      avatar: require('@/assets/images/yeosu.png'),
      isOnline: false,
      members: 9,
      lastActive: '5 days ago',
      type: 'group',
      tags: ['yeosu', 'ocean']
    },
  };

  // 채팅 필터링 - 검색어, 타입, 읽지 않은 메시지 기준
  const filterChats = (searchQuery: string, filterType: string) => {
    return chats.filter(chat => {
      // 검색어 필터
      const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 필터 타입 (전체, 그룹, 개인)
      const matchesFilter = filterType === 'all' || 
                          (filterType === 'groups' && chat.type === 'group') ||
                          (filterType === 'direct' && chat.type === 'direct');
      
      // 읽지 않은 메시지 필터
      const matchesUnread = filterType === 'unread' ? chat.unread > 0 : true;
      
      return matchesSearch && matchesFilter && matchesUnread;
    });
  };

  // 새 메시지 생성
  const createNewChat = () => {
    Alert.alert('New Chat', 'This feature will be implemented in future updates.');
  };

  // 특정 채팅방의 메시지 가져오기
  const getChatMessages = (chatId: string): Message[] => {
    // 각 채팅방별 샘플 메시지 데이터
    const messagesMap: { [key: string]: Message[] } = {
      '1': [
        {
          id: '1',
          text: 'Hello everyone! I\'m planning to visit the palace tomorrow. Anyone interested in joining?',
          sender: 'other',
          timestamp: '10:30 AM',
          read: true
        },
        {
          id: '2',
          text: 'I\'d love to join! What time are you planning to go?',
          sender: 'me',
          timestamp: '10:32 AM',
          read: true
        },
        {
          id: '3',
          text: 'I\'m thinking around 10 AM. We could meet at the main entrance.',
          sender: 'other',
          timestamp: '10:33 AM',
          read: true
        },
        {
          id: '4',
          text: 'Sounds good to me! I\'ll be there.',
          sender: 'me',
          timestamp: '10:35 AM',
          read: true
        },
        {
          id: '5',
          text: 'Great! Anyone else joining us for the palace tour tomorrow?',
          sender: 'other',
          timestamp: '10:36 AM',
          read: true
        },
      ],
      // 다른 채팅방 메시지도 추가 가능
    };
    
    return messagesMap[chatId] || [];
  };

  // 메시지 전송
  const sendMessage = (chatId: string, messageText: string): Promise<Message> => {
    return new Promise((resolve) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        read: false
      };

      // 실제 구현에서는 API 호출 등을 통해 메시지를 전송하고 응답을 받아야 함
      setTimeout(() => {
        resolve(newMessage);
      }, 500);
    });
  };

  // 읽지 않은 메시지 수 업데이트
  const markChatAsRead = (chatId: string) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  };

  return {
    chats,
    chatRooms,
    filterChats,
    createNewChat,
    getChatMessages,
    sendMessage,
    markChatAsRead
  };
};

export default useChat; 