import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  TextInput,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { authAPI } from '../services/api';

interface UserProfile {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  email?: string;
  phone?: string;
}

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState({
    notifications: true,
    autoSync: true,
    locationTracking: true,
    offlineMode: false
  });
  const [appInfo, setAppInfo] = useState({
    version: '1.0.0',
    buildNumber: '100',
    lastUpdate: '2025-01-30'
  });

  useEffect(() => {
    loadUserProfile();
    loadSettings();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setEditedUser(parsedUser);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const settingsData = await AsyncStorage.getItem('appSettings');
      if (settingsData) {
        setSettings(JSON.parse(settingsData));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: typeof settings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? Any unsaved data will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authAPI.logout();
              // The app will automatically navigate to login screen
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editedUser) return;

    try {
      await AsyncStorage.setItem('user', JSON.stringify(editedUser));
      setUser(editedUser);
      setIsEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile changes');
    }
  };

  const renderProfileCard = () => (
    <View style={styles.profileCard}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Text>
        </View>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.profileUsername}>@{user?.username}</Text>
        <Text style={styles.profileRole}>{user?.role || 'Mobile User'}</Text>
        {user?.department && (
          <Text style={styles.profileDepartment}>{user.department}</Text>
        )}
      </View>
      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Ionicons name="create-outline" size={20} color="#3b82f6" />
      </TouchableOpacity>
    </View>
  );

  const renderSettingsSection = () => (
    <View style={styles.settingsContainer}>
      <Text style={styles.sectionTitle}>Settings</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="notifications-outline" size={20} color="#6b7280" />
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive alerts and updates
            </Text>
          </View>
        </View>
        <Switch
          value={settings.notifications}
          onValueChange={(value) => saveSettings({...settings, notifications: value})}
          trackColor={{ false: '#d1d5db', true: '#16a34a' }}
          thumbColor="#ffffff"
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="sync-outline" size={20} color="#6b7280" />
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Auto Sync</Text>
            <Text style={styles.settingDescription}>
              Automatically sync when online
            </Text>
          </View>
        </View>
        <Switch
          value={settings.autoSync}
          onValueChange={(value) => saveSettings({...settings, autoSync: value})}
          trackColor={{ false: '#d1d5db', true: '#16a34a' }}
          thumbColor="#ffffff"
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="location-outline" size={20} color="#6b7280" />
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Location Tracking</Text>
            <Text style={styles.settingDescription}>
              Enable GPS mapping features
            </Text>
          </View>
        </View>
        <Switch
          value={settings.locationTracking}
          onValueChange={(value) => saveSettings({...settings, locationTracking: value})}
          trackColor={{ false: '#d1d5db', true: '#16a34a' }}
          thumbColor="#ffffff"
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="cloud-offline-outline" size={20} color="#6b7280" />
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Offline Mode Priority</Text>
            <Text style={styles.settingDescription}>
              Prioritize offline functionality
            </Text>
          </View>
        </View>
        <Switch
          value={settings.offlineMode}
          onValueChange={(value) => saveSettings({...settings, offlineMode: value})}
          trackColor={{ false: '#d1d5db', true: '#16a34a' }}
          thumbColor="#ffffff"
        />
      </View>
    </View>
  );

  const renderAppInfoSection = () => (
    <View style={styles.appInfoContainer}>
      <Text style={styles.sectionTitle}>App Information</Text>
      
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Version</Text>
        <Text style={styles.infoValue}>{appInfo.version}</Text>
      </View>
      
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Build Number</Text>
        <Text style={styles.infoValue}>{appInfo.buildNumber}</Text>
      </View>
      
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Last Update</Text>
        <Text style={styles.infoValue}>{appInfo.lastUpdate}</Text>
      </View>
      
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Platform</Text>
        <Text style={styles.infoValue}>React Native / Expo</Text>
      </View>
    </View>
  );

  const renderEditModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isEditModalVisible}
      onRequestClose={() => setIsEditModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>First Name</Text>
              <TextInput
                style={styles.formInput}
                value={editedUser?.firstName || ''}
                onChangeText={(text) => 
                  setEditedUser(prev => prev ? {...prev, firstName: text} : null)
                }
                placeholder="Enter first name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Last Name</Text>
              <TextInput
                style={styles.formInput}
                value={editedUser?.lastName || ''}
                onChangeText={(text) => 
                  setEditedUser(prev => prev ? {...prev, lastName: text} : null)
                }
                placeholder="Enter last name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email</Text>
              <TextInput
                style={styles.formInput}
                value={editedUser?.email || ''}
                onChangeText={(text) => 
                  setEditedUser(prev => prev ? {...prev, email: text} : null)
                }
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Phone</Text>
              <TextInput
                style={styles.formInput}
                value={editedUser?.phone || ''}
                onChangeText={(text) => 
                  setEditedUser(prev => prev ? {...prev, phone: text} : null)
                }
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Department</Text>
              <TextInput
                style={styles.formInput}
                value={editedUser?.department || ''}
                onChangeText={(text) => 
                  setEditedUser(prev => prev ? {...prev, department: text} : null)
                }
                placeholder="Enter department"
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setIsEditModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      {user && renderProfileCard()}

      {/* Settings Section */}
      {renderSettingsSection()}

      {/* App Information */}
      {renderAppInfoSection()}

      {/* Support Section */}
      <View style={styles.supportContainer}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.supportItem}>
          <Ionicons name="help-circle-outline" size={20} color="#6b7280" />
          <Text style={styles.supportText}>Help & FAQ</Text>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.supportItem}>
          <Ionicons name="mail-outline" size={20} color="#6b7280" />
          <Text style={styles.supportText}>Contact Support</Text>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.supportItem}>
          <Ionicons name="document-text-outline" size={20} color="#6b7280" />
          <Text style={styles.supportText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {/* Edit Modal */}
      {renderEditModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  profileUsername: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '500',
  },
  profileDepartment: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  editButton: {
    padding: 8,
  },
  settingsContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  settingDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  appInfoContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#374151',
  },
  infoValue: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  supportContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  supportText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalBody: {
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#16a34a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfileScreen;