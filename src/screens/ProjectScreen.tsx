import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, ResearchPaper } from './types';
import { projectService } from '../services/projectService';

type ProjectScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Document {
  documentId: number;
  fileName: string;
  documentUrl: string;
  documentType: number;
  uploadAt: string;
}

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
  documents: Document[];
}

const ProjectScreen: React.FC = () => {
  const navigation = useNavigation<ProjectScreenNavigationProp>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setError(null);
      const response = await projectService.getMyProjects();
      console.log('Projects response:', response); // Add this for debugging
      if (response.statusCode === 200) {
        setProjects(response.data);
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

  useEffect(() => {
    fetchProjects();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchProjects().finally(() => setRefreshing(false));
  }, []);

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return '#FFA726'; // Pending - Orange
      case 1:
        return '#4CAF50'; // Approved - Green
      case 2:
        return '#F44336'; // Rejected - Red
      default:
        return '#9E9E9E'; // Default - Grey
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Approved';
      case 2:
        return 'Rejected';
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

  const handleProjectPress = (project: Project) => {
    const researchPaper: ResearchPaper = {
      id: project.projectId,
      type: project.projectType.toString(),
      title: project.projectName,
      abstract: project.description,
      publisher: 'Internal',
      department: {
        id: project.departmentId,
        name: 'Department', // You might want to fetch the actual department name
      },
      category: {
        id: 1, // You might want to map this properly
        name: 'Research',
      },
      status: project.status.toString(),
      submissionDate: project.createdAt,
      publicationDate: project.endDate,
      authors: [
        {
          name: 'Author', // You might want to fetch the actual author details
          role: 'Primary',
          email: 'author@example.com',
        },
      ],
      progress: 0, // You might want to calculate this
      royalties: {
        total: project.approvedBudget,
        received: 0, // You might want to track this
        pendingPayment: true,
      },
    };

    navigation.navigate('RequestDetail', {
      requestId: project.projectId,
      request: researchPaper,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F27429" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F27429']} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Projects</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateNewRequest')}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {error ? (
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
        ) : projects.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="documents-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No projects found</Text>
          </View>
        ) : (
          projects.map((project) => (
            <TouchableOpacity
              key={project.projectId}
              style={styles.projectCard}
              onPress={() => handleProjectPress(project)}
            >
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{project.projectName}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(project.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusText(project.status)}
                  </Text>
                </View>
              </View>

              <Text style={styles.description} numberOfLines={2}>
                {project.description}
              </Text>

              <View style={styles.projectInfo}>
                <View style={styles.infoItem}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="cash-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>
                    {formatBudget(project.approvedBudget)}
                  </Text>
                </View>
              </View>

              <View style={styles.projectFooter}>
                <View style={styles.infoItem}>
                  <Ionicons name="people-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>{project.groupName}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="document-attach-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>
                    {project.documents.length} documents
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#F27429',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
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
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  projectInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 300,
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