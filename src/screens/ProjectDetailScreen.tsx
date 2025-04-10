import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
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
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the access token from userData
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

      console.log('Project details response:', response);

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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
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
          onPress={fetchProjectDetails}
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.projectName}>{project.projectName || 'Untitled Project'}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
          <Text style={styles.statusText}>{getStatusText(project.status)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Type:</Text>
          <Text style={styles.infoValue}>{getProjectTypeText(project.projectType)}</Text>
        </View>
        {project.department && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Department:</Text>
            <Text style={styles.infoValue}>{project.department.departmentName}</Text>
          </View>
        )}
        {project.group && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Group:</Text>
            <Text style={styles.infoValue}>{project.group.groupName}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
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
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    marginRight: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 100,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  documentDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
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

export default ProjectDetailScreen; 