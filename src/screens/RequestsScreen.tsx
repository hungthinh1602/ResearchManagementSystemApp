import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from './types';

type RequestsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

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

export const RequestsScreen: React.FC = () => {
  const navigation = useNavigation<RequestsScreenNavigationProp>();
  
  // Helper function to navigate with proper typing
  const navigateTo = (screen: keyof RootStackParamList, params?: any) => {
    navigation.navigate(screen, params);
  };
  
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
  
  const handleRequestPress = (item: ResearchPaper) => {
    console.log('Request pressed:', item);
    
    navigateTo('RequestDetail', { 
      requestId: item.id, 
      request: item 
    });
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

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'published':
        return 'checkmark-circle';
      case 'accepted':
        return 'thumbs-up';
      case 'under review':
        return 'hourglass';
      case 'rejected':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  // Helper function to get paper type icon
  const getPaperTypeIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'conference':
        return 'people';
      case 'journal':
        return 'journal';
      case 'book':
        return 'book';
      default:
        return 'document-text';
    }
  };

  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.headerTitle}>Research Papers</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{requests.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{requests.filter(r => r.status === 'published').length}</Text>
          <Text style={styles.statLabel}>Published</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{requests.filter(r => r.status === 'under review').length}</Text>
          <Text style={styles.statLabel}>In Review</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={80} color="#ccc" />
      <Text style={styles.emptyText}>No research papers found</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f7" />

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyList}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => handleRequestPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.cardTop}>
              <View style={styles.typeContainer}>
                <Ionicons name={getPaperTypeIcon(item.type)} size={16} color="#555" />
                <Text style={styles.typeText}>{item.type}</Text>
              </View>
              <View style={[styles.statusContainer, { backgroundColor: getStatusColor(item.status) }]}>
                <Ionicons name={getStatusIcon(item.status)} size={14} color="#fff" />
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
              </View>
            </View>
            
            <Text style={styles.title}>{item.title}</Text>
            
            <Text style={styles.abstractText} numberOfLines={2}>
              {item.abstract}
            </Text>
            
            <View style={styles.metadataContainer}>
              <View style={styles.metadataItem}>
                <Ionicons name="business-outline" size={14} color="#666" />
                <Text style={styles.metadataText}>{item.department.name}</Text>
              </View>
              
              <View style={styles.metadataItem}>
                <Ionicons name="pricetag-outline" size={14} color="#666" />
                <Text style={styles.metadataText}>{item.category.name}</Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={styles.progressPercentage}>{item.progress}%</Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${item.progress}%` }
                  ]} 
                />
              </View>
            </View>
            
            <View style={styles.cardFooter}>
              <View style={styles.authorsPreview}>
                {item.authors.slice(0, 2).map((author, index) => (
                  <View key={index} style={styles.authorBadge}>
                    <Text style={styles.authorInitial}>{author.name.charAt(0)}</Text>
                  </View>
                ))}
                {item.authors.length > 2 && (
                  <View style={[styles.authorBadge, styles.authorMore]}>
                    <Text style={styles.authorInitial}>+{item.authors.length - 2}</Text>
          </View>
        )}
              </View>
              
              {item.royalties.total > 0 && (
                <View style={styles.royaltiesPreview}>
                  <Ionicons name="cash-outline" size={14} color="#F27429" />
                  <Text style={styles.royaltiesText}>
                    {formatCurrency(item.royalties.received)} / {formatCurrency(item.royalties.total)}
                  </Text>
                </View>
              )}
            </View>
      </TouchableOpacity>
        )}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F27429',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
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
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  metadataText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F27429',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F27429',
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorsPreview: {
    flexDirection: 'row',
  },
  authorBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  authorMore: {
    backgroundColor: '#e0e0e0',
  },
  authorInitial: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  royaltiesPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  royaltiesText: {
    fontSize: 12,
    color: '#F27429',
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default RequestsScreen;
