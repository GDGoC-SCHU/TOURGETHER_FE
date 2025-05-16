import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

export default function PrivacySettings() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    biometricLogin: true,
    locationSharing: true,
    profileVisibility: 'public',
    activityStatus: true,
    dataCollection: true,
    searchable: true,
    showTrips: true
  });

  const handleBack = () => {
    router.back();
  };

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof settings]
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <MaterialCommunityIcons name="key-change" size={20} color="#fff" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Change Password</Text>
              <Text style={styles.menuDescription}>Update your account password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
              <Text style={styles.settingDescription}>Add an extra layer of security</Text>
            </View>
            <Switch
              value={settings.twoFactorAuth}
              onValueChange={() => toggleSetting('twoFactorAuth')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={settings.twoFactorAuth ? Colors.light.accent : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Biometric Login</Text>
              <Text style={styles.settingDescription}>Use Face ID or fingerprint to login</Text>
            </View>
            <Switch
              value={settings.biometricLogin}
              onValueChange={() => toggleSetting('biometricLogin')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={settings.biometricLogin ? Colors.light.accent : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Location Sharing</Text>
              <Text style={styles.settingDescription}>Share your location with other users</Text>
            </View>
            <Switch
              value={settings.locationSharing}
              onValueChange={() => toggleSetting('locationSharing')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={settings.locationSharing ? Colors.light.accent : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: Colors.light.secondary }]}>
              <FontAwesome5 name="user-shield" size={18} color="#fff" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Profile Visibility</Text>
              <Text style={styles.menuDescription}>Control who can see your profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Activity Status</Text>
              <Text style={styles.settingDescription}>Show when you're active</Text>
            </View>
            <Switch
              value={settings.activityStatus}
              onValueChange={() => toggleSetting('activityStatus')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={settings.activityStatus ? Colors.light.accent : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Search Visibility</Text>
              <Text style={styles.settingDescription}>Allow others to find you by username</Text>
            </View>
            <Switch
              value={settings.searchable}
              onValueChange={() => toggleSetting('searchable')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={settings.searchable ? Colors.light.accent : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Trip Visibility</Text>
              <Text style={styles.settingDescription}>Show your trips on your profile</Text>
            </View>
            <Switch
              value={settings.showTrips}
              onValueChange={() => toggleSetting('showTrips')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={settings.showTrips ? Colors.light.accent : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: Colors.light.tertiary }]}>
              <MaterialCommunityIcons name="download" size={20} color="#fff" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Download My Data</Text>
              <Text style={styles.menuDescription}>Get a copy of your data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Data Collection</Text>
              <Text style={styles.settingDescription}>Help improve the app with usage data</Text>
            </View>
            <Switch
              value={settings.dataCollection}
              onValueChange={() => toggleSetting('dataCollection')}
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={settings.dataCollection ? Colors.light.accent : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: '#8E8E93' }]}>
              <MaterialCommunityIcons name="file-document-outline" size={20} color="#fff" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Privacy Policy</Text>
              <Text style={styles.menuDescription}>Read our privacy policy</Text>
            </View>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: '#666',
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