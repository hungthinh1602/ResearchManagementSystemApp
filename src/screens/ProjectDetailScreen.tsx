import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking,
  RefreshControl,
} from 'react-native';
import { RouteProp, useRoute, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { apiRequest, API_ENDPOINTS } from '../config/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProjectDetailRouteProp = RouteProp<RootStackParamList, 'ProjectDetail'>;

interface User {
  userId: number;
  username: string;
  fullName: string;
  email: string;
}

interface Group {
  groupId: number;
  groupName: string;
  groupType: number;
  currentMember: number;
  maxMember: number;
  groupDepartment: any;
  departmentName: string | null;
  members: any[];
}

interface Department {
  departmentId: number;
  departmentName: string;
}

interface Document {
  documentId: number;
  fileName: string;
  documentUrl: string;
  documentType: number;
  uploadAt: string;
}

interface ProjectResponse {
  statusCode: number;
  message: string;
  data: {
    createdByUser: User;
    approvedByUser: User | null;
    group: Group;
    department: Department;
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
    methodology: string;
    createdBy: number;
    approvedBy: number | null;
    groupId: number;
    groupName: string;
    departmentId: number;
    documents: Document[];
    milestones: any[];
  };
}

export const ProjectDetailScreen: React.FC = () => {
  const route = useRoute<ProjectDetailRouteProp>();
  const { projectId } = route.params;
  const [project, setProject] = useState<ProjectResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetails = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        setError('Please sign in to view project details');
        Alert.alert(
          'Authentication Required',
          'Please sign in to view project details',
          [{ text: 'OK' }]
        );
        return;
      }

      const userData = JSON.parse(userDataString);
      const token = userData.accessToken;
      
      if (!token) {
        setError('Please sign in to view project details');
        Alert.alert(
          'Authentication Required',
          'Please sign in to view project details',
          [{ text: 'OK' }]
        );
        return;
      }

      const response = await apiRequest(
        API_ENDPOINTS.PROJECT.GET_PROJECT_DETAIL(projectId),
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.statusCode === 200 && response.data) {
        setProject(response.data);
      } else if (response.statusCode === 401) {
        setError('Your session has expired. Please sign in again.');
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please sign in again.',
          [{ text: 'OK' }]
        );
      } else {
        setError(response.message || 'Failed to fetch project details');
      }
    } catch (error: any) {
      console.error('Error fetching project details:', error);
      if (error.message.includes('401')) {
        setError('Your session has expired. Please sign in again.');
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please sign in again.',
          [{ text: 'OK' }]
        );
      } else {
        setError(error.message || 'An error occurred while fetching project details');
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Initial load
  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Only fetch if we already have data (to avoid double fetch on initial load)
      if (project) {
        fetchProjectDetails(false);
      }
    }, [projectId])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProjectDetails(false).finally(() => setRefreshing(false));
  }, [projectId]);

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

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return '#FFA726'; // Orange for Pending
      case 1:
        return '#4CAF50'; // Green for Approved
      case 2:
        return '#F44336'; // Red for Rejected
      default:
        return '#9E9E9E'; // Grey for Unknown
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(budget);
  };

  const handleOpenDocument = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this document URL');
      }
    } catch (error) {
      console.error('Error opening document:', error);
      Alert.alert('Error', 'Failed to open document');
    }
  };

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
          onPress={() => fetchProjectDetails()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="document-text-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>Project not found</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#F27429']}
          tintColor="#F27429"
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.projectName}>{project.projectName || 'Untitled Project'}</Text>
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, { color: getStatusColor(project.status) }]}>
            {getStatusText(project.status)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Information</Text>
        <View style={styles.infoRow}>
          <Ionicons name="document-text-outline" size={20} color="#F27429" style={{ marginRight: 8 }} />
          <Text style={styles.infoLabel}>Type:</Text>
          <Text style={styles.infoValue}>{getProjectTypeText(project.projectType)}</Text>
        </View>
        {project.department && (
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={20} color="#F27429" style={{ marginRight: 8 }} />
            <Text style={styles.infoLabel}>Department:</Text>
            <Text style={styles.infoValue}>{project.department.departmentName}</Text>
          </View>
        )}
        {project.group && (
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#F27429" style={{ marginRight: 8 }} />
            <Text style={styles.infoLabel}>Group:</Text>
            <Text style={styles.infoValue}>{project.group.groupName}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Ionicons name="wallet-outline" size={20} color="#F27429" style={{ marginRight: 8 }} />
          <Text style={styles.infoLabel}>Budget:</Text>
          <Text style={styles.infoValue}>{formatBudget(project.approvedBudget)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        {project.startDate && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Start Date:</Text>
            <Text style={styles.infoValue}>{formatDate(project.startDate)}</Text>
          </View>
        )}
        {project.endDate && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>End Date:</Text>
            <Text style={styles.infoValue}>{formatDate(project.endDate)}</Text>
          </View>
        )}
        {project.createdAt && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>{formatDateTime(project.createdAt)}</Text>
          </View>
        )}
        {project.updatedAt && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Updated:</Text>
            <Text style={styles.infoValue}>{formatDateTime(project.updatedAt)}</Text>
          </View>
        )}
      </View>

      {project.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{project.description}</Text>
        </View>
      )}

      {project.methodology && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Methodology</Text>
          <Text style={styles.description}>{project.methodology}</Text>
        </View>
      )}

      {project.createdByUser && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Created By</Text>
          <View style={styles.userInfo}>
            <Ionicons name="person-circle-outline" size={24} color="#666" />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{project.createdByUser.fullName}</Text>
              <Text style={styles.userEmail}>{project.createdByUser.email}</Text>
            </View>
          </View>
        </View>
      )}

      {project.approvedByUser && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Approved By</Text>
          <View style={styles.userInfo}>
            <Ionicons name="person-circle-outline" size={24} color="#666" />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{project.approvedByUser.fullName}</Text>
              <Text style={styles.userEmail}>{project.approvedByUser.email}</Text>
            </View>
          </View>
        </View>
      )}

      {project.group && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Group Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{project.group.groupName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Members:</Text>
            <Text style={styles.infoValue}>
              {project.group.currentMember} / {project.group.maxMember}
            </Text>
          </View>
        </View>
      )}

      {project.documents && project.documents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>
          {project.documents.map((doc) => (
            <TouchableOpacity
              key={doc.documentId}
              style={styles.documentItem}
              onPress={() => handleOpenDocument(doc.documentUrl)}
            >
              <Ionicons name="document-outline" size={24} color="#F27429" />
              <View style={styles.documentInfo}>
                <Text style={styles.documentName}>{doc.fileName}</Text>
                <Text style={styles.documentDate}>
                  Uploaded: {formatDateTime(doc.uploadAt)}
                </Text>
              </View>
              <Ionicons name="open-outline" size={20} color="#666" />
            </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#F27429',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  projectName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F27429',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F27429',
    paddingLeft: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  infoLabel: {
    width: 120,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  documentInfo: {
    flex: 1,
    marginLeft: 16,
  },
  documentName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  documentDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
});

export default ProjectDetailScreen; 