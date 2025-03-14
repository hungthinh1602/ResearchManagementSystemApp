import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'request' | 'update' | 'payment' | 'system';
}

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Research Request',
      message: 'Your research paper "Machine Learning Applications in Education" has been accepted.',
      time: '2 hours ago',
      read: false,
      type: 'request'
    },
    {
      id: '2',
      title: 'Payment Received',
      message: 'You have received a royalty payment of 5,000,000 VND for your paper "Digital Transformation in Manufacturing".',
      time: '1 day ago',
      read: false,
      type: 'payment'
    },
    {
      id: '3',
      title: 'Status Update',
      message: 'Your paper "Sustainable Energy Solutions" has moved to the review stage.',
      time: '2 days ago',
      read: false,
      type: 'update'
    },
    {
      id: '4',
      title: 'System Maintenance',
      message: 'The system will be under maintenance on Sunday, June 30th from 2:00 AM to 4:00 AM.',
      time: '3 days ago',
      read: true,
      type: 'system'
    },
    {
      id: '5',
      title: 'New Co-Author Request',
      message: 'Dr. Lisa Nguyen has requested to be added as a co-author to your paper "Digital Transformation in Manufacturing".',
      time: '5 days ago',
      read: true,
      type: 'request'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'request':
        return 'document-text';
      case 'update':
        return 'refresh-circle';
      case 'payment':
        return 'cash';
      case 'system':
        return 'settings';
      default:
        return 'notifications';
    }
  };

  const getIconColorForType = (type: Notification['type']) => {
    switch (type) {
      case 'request':
        return '#2196F3'; // Blue
      case 'update':
        return '#4CAF50'; // Green
      case 'payment':
        return '#F27429'; // Orange (your app's primary color)
      case 'system':
        return '#9E9E9E'; // Grey
      default:
        return '#F27429';
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconColorForType(item.type) + '20' }]}>
        <Ionicons name={getIconForType(item.type)} size={24} color={getIconColorForType(item.type)} />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Remove this duplicate title */}
        {/* <Text style={styles.headerTitle}>Notifications</Text> */}
        
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Changed from 'space-between' to 'flex-end'
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  markAllText: {
    color: '#F27429',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: '#fff',
    borderLeftWidth: 3,
    borderLeftColor: '#F27429',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F27429',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});

export default NotificationsScreen; 