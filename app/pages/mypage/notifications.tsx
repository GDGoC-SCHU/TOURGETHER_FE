import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

export default function NotificationSettings() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    emailEnabled: true,
    newMessage: true,
    newComment: true,
    tripUpdates: true,
    recommendations: true,
    marketing: false,
    newsletter: false,
    soundEnabled: true,
    vibrationEnabled: true,
    doNotDisturb: false
  });

  const handleBack = () => {
    router.back();
  };

  const toggleSetting = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications]
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch
              value={notifications.pushEnabled}
              onValueChange={() => toggleSetting('pushEnabled')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={notifications.pushEnabled ? Colors.light.accent : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Email Notifications</Text>
            <Switch
              value={notifications.emailEnabled}
              onValueChange={() => toggleSetting('emailEnabled')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={notifications.emailEnabled ? Colors.light.accent : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>New Messages</Text>
              <Text style={styles.settingDescription}>Get notified when you receive new messages</Text>
            </View>
            <Switch
              value={notifications.newMessage}
              onValueChange={() => toggleSetting('newMessage')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={notifications.newMessage ? Colors.light.accent : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Comments</Text>
              <Text style={styles.settingDescription}>Get notified about comments on your posts</Text>
            </View>
            <Switch
              value={notifications.newComment}
              onValueChange={() => toggleSetting('newComment')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={notifications.newComment ? Colors.light.accent : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Trip Updates</Text>
              <Text style={styles.settingDescription}>Get updates about your planned trips</Text>
            </View>
            <Switch
              value={notifications.tripUpdates}
              onValueChange={() => toggleSetting('tripUpdates')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={notifications.tripUpdates ? Colors.light.accent : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Recommendations</Text>
              <Text style={styles.settingDescription}>Get personalized travel recommendations</Text>
            </View>
            <Switch
              value={notifications.recommendations}
              onValueChange={() => toggleSetting('recommendations')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={notifications.recommendations ? Colors.light.accent : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marketing</Text>
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Marketing Emails</Text>
              <Text style={styles.settingDescription}>Receive special offers and promotions</Text>
            </View>
            <Switch
              value={notifications.marketing}
              onValueChange={() => toggleSetting('marketing')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={notifications.marketing ? Colors.light.accent : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Newsletter</Text>
              <Text style={styles.settingDescription}>Weekly updates and travel tips</Text>
            </View>
            <Switch
              value={notifications.newsletter}
              onValueChange={() => toggleSetting('newsletter')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={notifications.newsletter ? Colors.light.accent : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound & Vibration</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Sound</Text>
            <Switch
              value={notifications.soundEnabled}
              onValueChange={() => toggleSetting('soundEnabled')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={notifications.soundEnabled ? Colors.light.accent : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Vibration</Text>
            <Switch
              value={notifications.vibrationEnabled}
              onValueChange={() => toggleSetting('vibrationEnabled')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={notifications.vibrationEnabled ? Colors.light.accent : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Do Not Disturb</Text>
              <Text style={styles.settingDescription}>Mute notifications during specified hours</Text>
            </View>
            <Switch
              value={notifications.doNotDisturb}
              onValueChange={() => toggleSetting('doNotDisturb')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={notifications.doNotDisturb ? Colors.light.accent : "#f4f3f4"}
            />
          </View>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    maxWidth: '80%',
  },
}); 