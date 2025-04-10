import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from './types';
import { apiRequest, API_ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RequestsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Project {
  projectId: number;
  projectName: string;
  projectType: number;
  description: string;
  approvedBudget: number;
  status: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string | null;
  groupId: number;
  groupName: string;
  departmentId: number;
}

interface ProjectStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const RequestsScreen: React.FC = () => {
  const navigation = useNavigation<RequestsScreenNavigationProp>();
  const [requests, setRequests] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        setError('Please sign in to view requests');
        Alert.alert(
          'Authentication Required',
          'Please sign in to view requests',
          [{ text: 'OK' }]
        );
        return;
      }

      const userData = JSON.parse(userDataString);
      const token = userData.accessToken;
      
      if (!token) {
        setError('Please sign in to view requests');
        Alert.alert(
          'Authentication Required',
          'Please sign in to view requests',
          [{ text: 'OK' }]
        );
        return;
      }

      const response = await apiRequest(
        API_ENDPOINTS.PROJECT.GET_MY_PROJECTS,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.statusCode === 200) {
        // Calculate stats from all projects
        const allProjects = response.data;
        const newStats: ProjectStats = {
          total: allProjects.length,
          pending: allProjects.filter((p: Project) => p.status === 0).length,
          approved: allProjects.filter((p: Project) => p.status === 1).length,
          rejected: allProjects.filter((p: Project) => p.status === 2).length,
        };
        setStats(newStats);
        
        // Filter to show only pending projects (status === 0)
        const pendingProjects = allProjects.filter((project: Project) => project.status === 0);
        setRequests(pendingProjects);
      } else if (response.statusCode === 401) {
        setError('Your session has expired. Please sign in again.');
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please sign in again.',
          [{ text: 'OK' }]
        );
      } else {
        setError(response.message || 'Failed to fetch requests');
      }
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      if (error.message.includes('401')) {
        setError('Your session has expired. Please sign in again.');
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please sign in again.',
          [{ text: 'OK' }]
        );
      } else {
        setError(error.message || 'An error occurred while fetching requests');
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Initial load
  useEffect(() => {
    fetchRequests();
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Only fetch if we already have data (to avoid double fetch on initial load)
      if (requests.length > 0) {
        fetchRequests(false);
      }
    }, [requests.length])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests(false).finally(() => setRefreshing(false));
  }, []);

  const handleRequestPress = (project: Project) => {
    navigation.navigate('ProjectDetail', {
      projectId: project.projectId,
    });
  };

  const getProjectTypeText = (type: number) => {
    switch (type) {
      case 0:
        return 'Research';
      case 1:
        return 'Development';
      case 2:
        return 'Other';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderRequestItem = ({ item }: { item: Project }) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => handleRequestPress(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.projectName}>{item.projectName}</Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{getProjectTypeText(item.projectType)}</Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.footerInfo}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.groupName}>{item.groupName}</Text>
        </View>
        <View style={styles.footerInfo}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.date}>{formatDate(item.startDate)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderStatsBar = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsCard}>
        <View style={styles.statsItem}>
          <Text style={styles.statsValue}>{stats.total}</Text>
          <Text style={styles.statsLabel}>Total</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsItem}>
          <Text style={[styles.statsValue, { color: '#F27429' }]}>{stats.pending}</Text>
          <Text style={styles.statsLabel}>Pending</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsItem}>
          <Text style={[styles.statsValue, { color: '#4CAF50' }]}>{stats.approved}</Text>
          <Text style={styles.statsLabel}>Approved</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsItem}>
          <Text style={[styles.statsValue, { color: '#FF3B30' }]}>{stats.rejected}</Text>
          <Text style={styles.statsLabel}>Rejected</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F27429" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchRequests()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderStatsBar()}
      <FlatList
        data={requests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.projectId.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#F27429']}
            tintColor="#F27429"
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="documents-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No pending requests found</Text>
          </View>
        )}
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
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  typeBadge: {
    backgroundColor: '#F27429',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#F27429',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#F27429',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsItem: {
    flex: 1,
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statsDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 8,
  },
});

export default RequestsScreen;
