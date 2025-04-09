import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from './types';
import { projectService } from '../services/projectService';

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
  methodology: string | null;
  createdBy: number;
  approvedBy: number | null;
  groupId: number;
  groupName: string;
  departmentId: number;
  documents: Array<{
    documentId: number;
    fileName: string;
    documentUrl: string;
    documentType: number;
    uploadAt: string;
  }>;
}

interface ProjectStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const RequestsScreen: React.FC = () => {
  const navigation = useNavigation<RequestsScreenNavigationProp>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setError(null);
      const response = await projectService.getMyProjects();
      console.log('Projects response:', response);
      if (response.statusCode === 200) {
        setAllProjects(response.data);
        // Filter to show all projects except Approved ones (status !== 1)
        const nonApprovedProjects = response.data.filter((project: Project) => project.status !== 1);
        setProjects(nonApprovedProjects);
        
        // Calculate stats
        const newStats: ProjectStats = {
          total: response.data.length,
          pending: response.data.filter((p: Project) => p.status === 0).length,
          approved: response.data.filter((p: Project) => p.status === 1).length,
          rejected: response.data.filter((p: Project) => p.status === 2).length,
        };
        setStats(newStats);
      } else {
        setError(response.message || 'Failed to fetch projects');
      }
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      if (error.message === 'No access token found') {
        setError('Please sign in again to view your projects');
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please sign in again.',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('Auth')
            }
          ]
        );
      } else {
        setError(error.message || 'An error occurred while fetching projects');
        Alert.alert(
          'Error',
          'Failed to load projects. Please check your connection and try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRequests();
  }, []);

  // Auto refresh every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!refreshing) { // Only fetch if not manually refreshing
        console.log('Auto-refreshing requests...');
        fetchRequests();
      }
    }, 10000); // 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchRequests().finally(() => setRefreshing(false));
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

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(budget);
  };

  const renderStatsBar = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsItem}>
        <Text style={styles.statsValue}>{stats.total}</Text>
        <Text style={styles.statsLabel}>Total</Text>
      </View>
      <View style={styles.statsDivider} />
      <View style={styles.statsItem}>
        <Text style={[styles.statsValue, { color: '#FFA726' }]}>{stats.pending}</Text>
        <Text style={styles.statsLabel}>Pending</Text>
      </View>
      <View style={styles.statsDivider} />
      <View style={styles.statsItem}>
        <Text style={[styles.statsValue, { color: '#4CAF50' }]}>{stats.approved}</Text>
        <Text style={styles.statsLabel}>Approved</Text>
      </View>
      <View style={styles.statsDivider} />
      <View style={styles.statsItem}>
        <Text style={[styles.statsValue, { color: '#F44336' }]}>{stats.rejected}</Text>
        <Text style={styles.statsLabel}>Rejected</Text>
      </View>
    </View>
  );

  const renderRequestItem = ({ item }: { item: Project }) => (
    <TouchableOpacity
      style={styles.requestItem}
      onPress={() => handleRequestPress(item)}
    >
      <View style={styles.requestHeader}>
        <Text style={styles.requestTitle}>{item.projectName}</Text>
        <View style={[
          styles.statusBadge, 
          item.status === 0 ? styles.pendingBadge : styles.rejectedBadge
        ]}>
          <Text style={styles.statusText}>
            {item.status === 0 ? 'Pending' : 'Rejected'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.requestType}>{getProjectTypeText(item.projectType)}</Text>
      
      <Text style={styles.requestDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.requestDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.groupName}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{formatDate(item.startDate)}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{formatBudget(item.approvedBudget)}</Text>
        </View>
      </View>
      
      <View style={styles.requestFooter}>
        <Text style={styles.requestDate}>
          Created: {formatDate(item.createdAt)}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
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
          onPress={() => {
            setLoading(true);
            fetchRequests();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Project Requests</Text>
        <Text style={styles.headerSubtitle}>
          {projects.length} {projects.length === 1 ? 'request' : 'requests'} to review
        </Text>
      </View>

      {renderStatsBar()}

      {projects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No requests found</Text>
          <Text style={styles.emptySubtext}>
            Your approved projects will appear in the Projects tab
          </Text>
        </View>
      ) : (
        <FlatList
          data={projects}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.projectId.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F27429']} />
          }
        />
      )}
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
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    fontSize: 14,
    color: '#666',
  },
  statsDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 8,
  },
  listContent: {
    padding: 16,
  },
  requestItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pendingBadge: {
    backgroundColor: '#FFA726',
  },
  rejectedBadge: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  requestType: {
    fontSize: 14,
    color: '#F27429',
    fontWeight: '500',
    marginBottom: 8,
  },
  requestDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
  },
  requestDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  requestDate: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#F27429',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RequestsScreen;
