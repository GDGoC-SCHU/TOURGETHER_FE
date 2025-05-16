import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

export default function AccountSettings() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(require('@/assets/images/profile.png'));
  const [formData, setFormData] = useState({
    username: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+82 10-1234-5678',
    bio: 'Adventure seeker | Travel enthusiast',
    location: 'Seoul, South Korea'
  });
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    // 저장 로직 구현
    router.back();
  };

  const handleImagePick = () => {
    // 이미지 선택 로직 구현
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.imageSection}>
          <View style={styles.profileImageContainer}>
            <Image source={profileImage} style={styles.profileImage} />
            <TouchableOpacity style={styles.editImageButton} onPress={handleImagePick}>
              <Feather name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={formData.username}
              onChangeText={(text) => setFormData({...formData, username: text})}
              placeholder="Enter username"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              placeholder="Enter email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={formData.bio}
              onChangeText={(text) => setFormData({...formData, bio: text})}
              placeholder="Write something about yourself"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData({...formData, location: text})}
              placeholder="Enter location"
            />
          </View>
        </View>

        <View style={styles.notificationSection}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.switchItem}>
            <Text style={styles.switchLabel}>Email Notifications</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={emailNotifications ? Colors.light.accent : "#f4f3f4"}
            />
          </View>

          <View style={styles.switchItem}>
            <Text style={styles.switchLabel}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={pushNotifications ? Colors.light.accent : "#f4f3f4"}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
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
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  saveButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.light.primary,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.light.card,
  },
  formSection: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  notificationSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 15,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  switchLabel: {
    fontSize: 16,
    color: Colors.light.text,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
}); 