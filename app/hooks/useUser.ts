import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  profileImage: string;
  stats: {
    visited: number;
    planned: number;
    reviews: number;
    photos: number;
  };
}

export default function useUser() {
  const { userId } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // TODO: 실제 API 엔드포인트로 변경
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const data = await response.json();
      setUserProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // 임시 더미 데이터
      setUserProfile({
        id: userId || '1',
        username: '김여행',
        email: 'travel.kim@example.com',
        phone: '+82 10-1234-5678',
        bio: '여행 좋아하는 프로여행러',
        location: '서울, 대한민국',
        profileImage: require('@/assets/images/profile.png'),
        stats: {
          visited: 8,
          planned: 3,
          reviews: 12,
          photos: 47
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    try {
      setLoading(true);
      // TODO: 실제 API 엔드포인트로 변경
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }
      
      const updatedData = await response.json();
      setUserProfile(prev => prev ? { ...prev, ...updatedData } : null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    userProfile,
    loading,
    error,
    fetchUserProfile,
    updateUserProfile
  };
} 