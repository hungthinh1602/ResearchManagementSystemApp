import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface UserData {
  userId: number;
  email: string;
  fullName: string;
  status: number;
  role: number;
  level: number;
  department: {
    departmentId: number;
    departmentName: string;
  };
  profileImageUrl: string;
  groups: Array<{
    groupId: number;
    groupName: string;
    role: number;
  }>;
}

interface ResearchSummary {
  total: number;
  published: number;
  inReview: number;
  drafts: number;
}

interface UpcomingDeadline {
  id: string;
  title: string;
  paperTitle: string;
  date: string;
  daysRemaining: number;
  paperId?: number;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      console.log('User data from AsyncStorage:', userDataString);
      
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        console.log('Parsed user data:', userData);
        console.log('Full name:', userData.fullName);
        setUserData(userData);
      } else {
        console.log('No user data found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Helper function to navigate with proper typing
  const navigateTo = (screen: keyof RootStackParamList, params?: any) => {
    navigation.navigate(screen, params);
  };

  // Mock data for research summary
  const [researchSummary] = useState<ResearchSummary>({
    total: 12,
    published: 5,
    inReview: 3,
    drafts: 4,
  });

  // Mock data for upcoming deadlines
  const [upcomingDeadlines] = useState<UpcomingDeadline[]>([
    {
      id: '1',
      title: 'Revision Deadline',
      paperTitle: 'Machine Learning Applications in Education',
      date: '2024-06-15',
      daysRemaining: 12,
      paperId: 1,
    },
    {
      id: '2',
      title: 'Conference Submission',
      paperTitle: 'Blockchain in Healthcare',
      date: '2024-07-01',
      daysRemaining: 28,
    },
  ]);

  // Mock data for featured research
  const [featuredResearch] = useState({
    id: 2,
    title: 'Digital Transformation in Manufacturing',
    citations: 24,
    downloads: 156,
    thumbnail: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // Helper function to format date and calculate days remaining
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeadlinePress = (deadline: UpcomingDeadline) => {
    if (deadline.paperId) {
      // Navigate to the paper details
      navigateTo('RequestDetail', { requestId: deadline.paperId });
    }
  };

  const handleFeaturedResearchPress = () => {
    navigateTo('RequestDetail', { requestId: featuredResearch.id });
  };

  const handleViewAllPapers = () => {
    navigateTo('Requests');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f7" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F27429']} />
        }
      >
        {/* Welcome Header */}
        <View style={styles.welcomeContainer}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{userData?.fullName || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => navigateTo('Profile')}>
            <Ionicons name="person-circle" size={40} color="#F27429" />
          </TouchableOpacity>
        </View>

        {/* Research Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <TouchableOpacity 
              style={[styles.summaryCard, styles.primaryCard]} 
              onPress={handleViewAllPapers}
            >
              <Text style={styles.summaryValue}>{researchSummary.total}</Text>
              <Text style={styles.summaryLabel}>Total Papers</Text>
              <Ionicons name="documents-outline" size={24} color="#fff" style={styles.summaryIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.summaryCard, styles.secondaryCard]} 
              onPress={handleViewAllPapers}
            >
              <Text style={styles.summaryValue}>{researchSummary.published}</Text>
              <Text style={styles.summaryLabel}>Published</Text>
              <Ionicons name="checkmark-circle-outline" size={24} color="#fff" style={styles.summaryIcon} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.summaryRow}>
            <TouchableOpacity 
              style={[styles.summaryCard, styles.tertiaryCard]} 
              onPress={handleViewAllPapers}
            >
              <Text style={styles.summaryValue}>{researchSummary.inReview}</Text>
              <Text style={styles.summaryLabel}>In Review</Text>
              <Ionicons name="hourglass-outline" size={24} color="#fff" style={styles.summaryIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.summaryCard, styles.quaternaryCard]} 
              onPress={handleViewAllPapers}
            >
              <Text style={styles.summaryValue}>{researchSummary.drafts}</Text>
              <Text style={styles.summaryLabel}>Drafts</Text>
              <Ionicons name="document-outline" size={24} color="#fff" style={styles.summaryIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Research */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Research</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.featuredResearchCard}
            onPress={handleFeaturedResearchPress}
          >
            <Image 
              source={{ uri: featuredResearch.thumbnail }} 
              style={styles.featuredImage}
              resizeMode="cover"
            />
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>{featuredResearch.title}</Text>
              <View style={styles.featuredStats}>
                <View style={styles.featuredStatItem}>
                  <Ionicons name="bookmark-outline" size={16} color="#666" />
                  <Text style={styles.featuredStatText}>{featuredResearch.citations} Citations</Text>
                </View>
                <View style={styles.featuredStatItem}>
                  <Ionicons name="download-outline" size={16} color="#666" />
                  <Text style={styles.featuredStatText}>{featuredResearch.downloads} Downloads</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Upcoming Deadlines */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
          </View>
          
          {upcomingDeadlines.length > 0 ? (
            upcomingDeadlines.map(deadline => (
              <TouchableOpacity 
                key={deadline.id} 
                style={styles.deadlineCard}
                onPress={() => handleDeadlinePress(deadline)}
              >
                <View style={styles.deadlineInfo}>
                  <Text style={styles.deadlineTitle}>{deadline.title}</Text>
                  <Text style={styles.deadlinePaper} numberOfLines={1}>{deadline.paperTitle}</Text>
                  <Text style={styles.deadlineDate}>{formatDate(deadline.date)}</Text>
                </View>
                <View style={[
                  styles.deadlineDaysContainer, 
                  deadline.daysRemaining <= 7 ? styles.urgentDeadline : {}
                ]}>
                  <Text style={styles.deadlineDaysValue}>{deadline.daysRemaining}</Text>
                  <Text style={styles.deadlineDaysLabel}>days left</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="calendar-outline" size={40} color="#ccc" />
              <Text style={styles.emptyStateText}>No upcoming deadlines</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // Two cards per row with margins

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    width: cardWidth,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryCard: {
    backgroundColor: '#F27429', // Primary orange
  },
  secondaryCard: {
    backgroundColor: '#4CAF50', // Green
  },
  tertiaryCard: {
    backgroundColor: '#2196F3', // Blue
  },
  quaternaryCard: {
    backgroundColor: '#9C27B0', // Purple
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summaryIcon: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    opacity: 0.5,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  viewAllButton: {
    padding: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#F27429',
    fontWeight: '600',
  },
  featuredResearchCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredImage: {
    width: '100%',
    height: 160,
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  featuredStats: {
    flexDirection: 'row',
  },
  featuredStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  featuredStatText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  deadlineCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  deadlineInfo: {
    flex: 1,
    marginRight: 16,
  },
  deadlineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  deadlinePaper: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  deadlineDate: {
    fontSize: 12,
    color: '#999',
  },
  deadlineDaysContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  urgentDeadline: {
    backgroundColor: '#FFEBEE',
  },
  deadlineDaysValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2196F3',
  },
  deadlineDaysLabel: {
    fontSize: 10,
    color: '#2196F3',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
  },
});

export default HomeScreen;