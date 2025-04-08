import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

interface Group {
  groupId: number;
  groupName: string;
  role: number;
}

interface UserProfile {
  userId: number;
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  roleId: number | null;
  departmentId: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  groups: Group[];
  level: string;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: UserProfile;
}

const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        Alert.alert('Error', 'User data not found');
        return;
      }

      const { userId, accessToken } = JSON.parse(userData);
      
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': '*/*'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data: ApiResponse = await response.json();
      if (data.statusCode === 200) {
        setProfile(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F27429" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Ionicons name="person-circle" size={100} color="#F27429" />
        </View>
        <Text style={styles.name}>{profile?.fullName || 'N/A'}</Text>
        <Text style={styles.role}>Level: {profile?.level || 'N/A'}</Text>
        <Text style={styles.email}>{profile?.email || 'N/A'}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={20} color="#666" />
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{profile?.phone || 'N/A'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={20} color="#666" />
          <Text style={styles.infoLabel}>Username:</Text>
          <Text style={styles.infoValue}>{profile?.username || 'N/A'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="business-outline" size={20} color="#666" />
          <Text style={styles.infoLabel}>Department:</Text>
          <Text style={styles.infoValue}>{profile?.departmentId || 'N/A'}</Text>
        </View>
      </View>

      {profile?.groups && profile.groups.length > 0 && (
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Groups</Text>
          {profile.groups.map((group, index) => (
            <View key={group.groupId} style={[styles.infoItem, index === profile.groups.length - 1 && styles.lastItem]}>
              <Ionicons name="people-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Group {index + 1}:</Text>
              <Text style={styles.infoValue}>{group.groupName} (Role: {group.role})</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f7',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#999',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  lastItem: {
    marginBottom: 0,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});

export default ProfileScreen;
