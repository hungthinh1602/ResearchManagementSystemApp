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

type ProjectScreenNavigationProp = StackNavigationProp<RootStackParamList>;

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

export const ProjectScreen: React.FC = () => {
  const navigation = useNavigation<ProjectScreenNavigationProp>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setError(null);
      const response = await projectService.getMyProjects();
      console.log('Projects response:', response);
      if (response.statusCode === 200) {
        // Filter to only show Approved projects (status === 1)
        const approvedProjects = response.data.filter((project: Project) => project.status === 1);
        const departmentIds = response.data.map((project: Project) => project.departmentId);
        console.log('Department IDs:', departmentIds);
        setProjects(approvedProjects);
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
    fetchProjects();
  }, []);

  // Auto refresh every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!refreshing) { // Only fetch if not manually refreshing
        console.log('Auto-refreshing projects...');
        fetchProjects();
      }
    }, 10000); // 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchProjects().finally(() => setRefreshing(false));
  }, []);

  const handleProjectPress = (project: Project) => {
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

  const renderProjectItem = ({ item }: { item: Project }) => (
    <TouchableOpacity
      style={styles.projectItem}
      onPress={() => handleProjectPress(item)}
    >
      <View style={styles.projectHeader}>
        <Text style={styles.projectTitle}>{item.projectName}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Approved</Text>
        </View>
      </View>
      
      <Text style={styles.projectType}>{getProjectTypeText(item.projectType)}</Text>
      
      <Text style={styles.projectDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.projectDetails}>
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
      
      <View style={styles.projectFooter}>
        <Text style={styles.projectDate}>
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
            fetchProjects();
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
        <Text style={styles.headerTitle}>Approved Projects</Text>
        <Text style={styles.headerSubtitle}>
          {projects.length} {projects.length === 1 ? 'project' : 'projects'} in progress
        </Text>
      </View>

      {projects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No approved projects found</Text>
          <Text style={styles.emptySubtext}>
            Your pending projects will appear in the Requests tab
          </Text>
        </View>
      ) : (
        <FlatList
          data={projects}
          renderItem={renderProjectItem}
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
  listContent: {
    padding: 16,
  },
  projectItem: {
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
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  projectType: {
    fontSize: 14,
    color: '#F27429',
    fontWeight: '500',
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
  },
  projectDetails: {
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
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  projectDate: {
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

export default ProjectScreen; 