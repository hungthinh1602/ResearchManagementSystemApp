import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
} from '../store/slices/notificationSlice';
import { format } from 'date-fns';
import { apiRequest, API_ENDPOINTS } from '../config/api';

interface Notification {
  notificationId: number;
  createdAt: string;
  projectId: number | null;
  title: string;
  message: string;
  status: number;
  isRead: boolean;
  invitationId: number;
  userId: number;
}

const NotificationsScreen: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const {
    data: notifications,
    isLoading,
    error,
    refetch,
  } = useGetNotificationsQuery(userId ?? 0, {
    skip: !userId,
  });

  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsed = JSON.parse(userData);
          setUserId(parsed.userId);
          setAccessToken(parsed.accessToken);
        }
      } catch (error) {
        console.error('Error getting user data:', error);
      }
    };

    getUserData();
  }, []);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId).unwrap();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleInvitation = async (notification: Notification) => {
    if (!notification.invitationId || !accessToken) return;

    Alert.alert(
      'Group Invitation',
      'Do you want to join this group?',
      [
        {
          text: 'Reject',
          onPress: async () => {
            try {
              const response = await apiRequest(
                API_ENDPOINTS.INVITATIONS.REJECT(notification.invitationId),
                { 
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${accessToken}`,
                  },
                }
              );
              if (response.statusCode === 200) {
                Alert.alert('Success', 'Invitation rejected successfully');
                refetch(); // Refresh the notifications list
              }
            } catch (error: any) {
              console.error('Error rejecting invitation:', error);
              if (error.message?.includes('already been processed')) {
                Alert.alert(
                  'Already Processed',
                  'This invitation has already been handled.'
                );
              } else {
                Alert.alert('Error', 'Failed to reject invitation');
              }
            }
          },
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              const response = await apiRequest(
                API_ENDPOINTS.INVITATIONS.ACCEPT(notification.invitationId),
                { 
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${accessToken}`,
                  },
                }
              );
              if (response.statusCode === 200) {
                Alert.alert('Success', 'You have joined the group successfully');
                refetch(); // Refresh the notifications list
              }
            } catch (error: any) {
              console.error('Error accepting invitation:', error);
              if (error.message?.includes('already been processed')) {
                Alert.alert(
                  'Already Processed',
                  'This invitation has already been handled.'
                );
              } else {
                Alert.alert('Error', 'Failed to accept invitation');
              }
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const renderNotification = ({ item }: { item: Notification }) => {
    const formattedDate = format(new Date(item.createdAt), 'MMM dd, yyyy HH:mm');

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.isRead && styles.unreadNotification,
        ]}
        onPress={() => {
          handleMarkAsRead(item.notificationId);
          if (item.title.includes('Group Invitation')) {
            handleInvitation(item);
          }
        }}
      >
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading || !userId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F27429" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error loading notifications</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.notificationId.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color="#999" />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
      />
    </View>
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
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadNotification: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#F27429',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
});

export default NotificationsScreen;