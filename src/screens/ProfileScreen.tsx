import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGetUserProfileQuery } from '../features/user/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Group {
  groupId: number;
  groupName: string;
  roleText?: string;
}

interface UserProfile {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  departmentId: number;
  level: number;
  levelText: string;
  groups: Group[];
}

const ProfileScreen: React.FC = () => {
  const [userId, setUserId] = React.useState<number | null>(null);

  React.useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsed = JSON.parse(userData);
          console.log('Stored user data:', parsed);
          setUserId(parsed.userId);
        } else {
          console.log('No userData found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error getting user data:', error);
      }
    };

    getUserData();
  }, []);

  const { data: profile, isLoading, error } = useGetUserProfileQuery(userId ?? 0, {
    skip: !userId
  });

  React.useEffect(() => {
    if (error) {
      console.error('Profile fetch error:', error);
    }
    if (profile) {
      console.log('Profile data:', profile);
    }
  }, [error, profile]);

  if (isLoading || !userId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F27429" />
      </View>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error loading profile</Text>
        <Text style={styles.errorDetail}>{errorMessage}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No profile data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Ionicons name="person-circle" size={100} color="#F27429" />
        </View>
        <Text style={styles.name}>{profile.fullName || 'N/A'}</Text>
        <Text style={styles.role}>{profile.levelText || 'N/A'}</Text>
        <Text style={styles.email}>{profile.email || 'N/A'}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={20} color="#666" />
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{profile.phone || 'N/A'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={20} color="#666" />
          <Text style={styles.infoLabel}>Username:</Text>
          <Text style={styles.infoValue}>{profile.username || 'N/A'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="business-outline" size={20} color="#666" />
          <Text style={styles.infoLabel}>Department:</Text>
          <Text style={styles.infoValue}>ID: {profile.departmentId || 'N/A'}</Text>
        </View>
      </View>

      {profile.groups && profile.groups.length > 0 && (
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Groups</Text>
          {profile.groups.map((group) => (
            <View key={group.groupId} style={styles.infoItem}>
              <Ionicons name="people-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Group:</Text>
              <Text style={styles.infoValue}>
                {group.groupName} ({group.roleText || 'N/A'})
              </Text>
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
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginBottom: 8,
  },
  errorDetail: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
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
