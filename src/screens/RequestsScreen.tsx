import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { useNavigation, NavigationProp, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import * as RootNavigation from '../navigation/navigationRef';

// Define the correct navigation type
type RequestsScreenNavigationProp = NavigationProp<RootStackParamList>;

// Define the interface for our research paper data
interface Author {
  name: string;
  role: string;
  email: string;
}

interface Department {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Royalties {
  total: number;
  received: number;
  pendingPayment: boolean;
}

interface ResearchPaper {
  id: number;
  type: string;
  title: string;
  abstract: string;
  publisher: string;
  department: Department;
  category: Category;
  status: string;
  submissionDate: string;
  publicationDate: string;
  authors: Author[];
  progress: number;
  royalties: Royalties;
}

export const PendingRequestScreen: React.FC = () => {
  // Use the correct navigation type
  const navigation = useNavigation<RequestsScreenNavigationProp>();
  
  // Mock data using the provided structure
  const [requests] = useState<ResearchPaper[]>([
    {
      id: 1,
      type: "Conference",
      title: "Machine Learning Applications in Education",
      abstract:
        "This paper explores innovative applications of machine learning in educational technology, focusing on personalized learning systems and student performance prediction.",
      publisher: "IEEE Transactions on Education",
      department: {
        id: 1,
        name: "Computer Science",
      },
      category: {
        id: 1,
        name: "AI & Machine Learning",
      },
      status: "accepted",
      submissionDate: "2024-02-15",
      publicationDate: "2024-05-20",
      authors: [
        {
          name: "Dr. Emily Smith",
          role: "Main Author",
          email: "emily.smith@university.edu",
        },
        {
          name: "Dr. Michael Chen",
          role: "Co-Author",
          email: "michael.chen@university.edu",
        },
      ],
      progress: 75,
      royalties: {
        total: 15000000,
        received: 5000000,
        pendingPayment: true,
      },
    },
    {
      id: 2,
      type: "Journal",
      title: "Digital Transformation in Manufacturing",
      abstract:
        "A comprehensive analysis of Industry 4.0 implementation challenges and solutions in Vietnamese manufacturing sector.",
      publisher: "Journal of Manufacturing Technology Management",
      department: {
        id: 2,
        name: "Information Technology",
      },
      category: {
        id: 5,
        name: "Digital Technology",
      },
      status: "published",
      submissionDate: "2024-01-10",
      publicationDate: "2024-04-15",
      authors: [
        {
          name: "Prof. Sarah Johnson",
          role: "Main Author",
          email: "sarah.johnson@university.edu",
        },
        {
          name: "Dr. Lisa Nguyen",
          role: "Co-Author",
          email: "lisa.nguyen@university.edu",
        },
      ],
      progress: 100,
      royalties: {
        total: 25000000,
        received: 25000000,
        pendingPayment: false,
      }
    },
    {
      id: 3,
      type: "Journal",
      title: "Sustainable Energy Solutions for Urban Development",
      abstract:
        "An exploration of renewable energy integration in urban planning with case studies from developing countries.",
      publisher: "Renewable and Sustainable Energy Reviews",
      department: {
        id: 3,
        name: "Environmental Engineering",
      },
      category: {
        id: 3,
        name: "Sustainability",
      },
      status: "under review",
      submissionDate: "2024-03-05",
      publicationDate: "",
      authors: [
        {
          name: "Dr. James Wilson",
          role: "Main Author",
          email: "james.wilson@university.edu",
        },
        {
          name: "Prof. Anh Tran",
          role: "Co-Author",
          email: "anh.tran@university.edu",
        },
      ],
      progress: 40,
      royalties: {
        total: 0,
        received: 0,
        pendingPayment: false,
      }
    }
  ]);

  // Helper function to navigate with proper typing
  const navigateTo = (screen: keyof RootStackParamList, params?: any) => {
    navigation.navigate(screen as never, params as never);
  };

  const handleCreateNewRequest = () => {
    navigateTo('CreateNewRequest');
  };
  
  const handleRequestPress = (item: ResearchPaper) => {
    navigateTo('RequestDetail', { requestId: item.id, request: item });
  };
  
  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'published':
        return '#4CAF50'; // Green
      case 'accepted':
        return '#2196F3'; // Blue
      case 'under review':
        return '#FF9800'; // Orange
      case 'rejected':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Grey
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Research Papers</Text>
      
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          // Wrap the entire card in TouchableOpacity
          <TouchableOpacity 
            style={styles.card}
            onPress={() => handleRequestPress(item)}
            activeOpacity={0.7} // Add this for better touch feedback
          >
            <View style={styles.cardHeader}>
              <View style={styles.typeContainer}>
                <Text style={styles.typeText}>{item.type}</Text>
              </View>
              <View style={[styles.statusContainer, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
              </View>
            </View>
            
            <Text style={styles.title}>{item.title}</Text>
            
            <Text style={styles.abstractText} numberOfLines={2}>
              {item.abstract}
            </Text>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Publisher:</Text>
                <Text style={styles.detailValue}>{item.publisher}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Department:</Text>
                <Text style={styles.detailValue}>{item.department.name}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Category:</Text>
                <Text style={styles.detailValue}>{item.category.name}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Submission:</Text>
                <Text style={styles.detailValue}>{item.submissionDate}</Text>
              </View>
              
              {item.publicationDate && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Publication:</Text>
                  <Text style={styles.detailValue}>{item.publicationDate}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.authorsContainer}>
              <Text style={styles.authorsLabel}>Authors:</Text>
              {item.authors.map((author, index) => (
                <Text key={index} style={styles.authorText}>
                  {author.name} ({author.role})
                </Text>
              ))}
            </View>
            
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Progress: {item.progress}%</Text>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${item.progress}%` }
                  ]} 
                />
              </View>
            </View>
            
            <View style={styles.royaltiesContainer}>
              <Text style={styles.royaltiesLabel}>Royalties:</Text>
              <View style={styles.royaltiesDetails}>
                <Text style={styles.royaltiesText}>
                  Total: {formatCurrency(item.royalties.total)}
                </Text>
                <Text style={styles.royaltiesText}>
                  Received: {formatCurrency(item.royalties.received)}
                </Text>
                {item.royalties.pendingPayment && (
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>Payment Pending</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleCreateNewRequest}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f7',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeContainer: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  abstractText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  detailsContainer: {
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    width: 100,
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  authorsContainer: {
    marginBottom: 12,
  },
  authorsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  authorText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 2,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F27429',
    borderRadius: 4,
  },
  royaltiesContainer: {
    marginTop: 8,
  },
  royaltiesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  royaltiesDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  royaltiesText: {
    fontSize: 13,
    color: '#333',
    marginRight: 12,
  },
  pendingBadge: {
    backgroundColor: '#ffecb3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  pendingText: {
    fontSize: 11,
    color: '#ff8f00',
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 80, 
    backgroundColor: '#F27429',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  floatingButtonText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: '600',
  },
});

export default PendingRequestScreen;
