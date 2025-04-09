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
import { projectService } from '../services/projectService';
import { Ionicons } from '@expo/vector-icons';

type ProjectDetailRouteProp = RouteProp<RootStackParamList, 'ProjectDetail'>;

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

export const ProjectDetailScreen: React.FC = () => {
  const route = useRoute<ProjectDetailRouteProp>();
  const { projectId } = route.params;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetails = async () => {
    try {
      setError(null);
      const response = await projectService.getProject(projectId);
      console.log('Project details response:', response);
      if (response.statusCode === 200) {
        setProject(response.data);
      } else {
        setError(response.message || 'Failed to fetch project details');
      }
    } catch (error: any) {
      console.error('Error fetching project details:', error);
      if (error.message === 'No access token found') {
        setError('Please sign in again to view project details');
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please sign in again.',
          [{ text: 'OK' }]
        );
      } else {
        setError(error.message || 'An error occurred while fetching project details');
        Alert.alert(
          'Error',
          'Failed to load project details. Please check your connection and try again.',
          [{ text: 'OK' }]
        );
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
          onPress={() => {
            setLoading(true);
            fetchProjectDetails();
          }}
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
        <Text style={styles.projectName}>{project.projectName}</Text>
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
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Group:</Text>
          <Text style={styles.infoValue}>{project.groupName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Budget:</Text>
          <Text style={styles.infoValue}>{formatBudget(project.approvedBudget)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Start Date:</Text>
          <Text style={styles.infoValue}>{formatDate(project.startDate)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>End Date:</Text>
          <Text style={styles.infoValue}>{formatDate(project.endDate)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Created:</Text>
          <Text style={styles.infoValue}>{formatDate(project.createdAt)}</Text>
        </View>
        {project.updatedAt && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>{formatDate(project.updatedAt)}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{project.description}</Text>
      </View>

      {project.methodology && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Methodology</Text>
          <Text style={styles.description}>{project.methodology}</Text>
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
                  Uploaded: {formatDate(doc.uploadAt)}
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