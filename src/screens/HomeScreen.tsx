import React, { useState } from 'react';
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

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface ResearchSummary {
  total: number;
  published: number;
  inReview: number;
  drafts: number;
}

interface RecentActivity {
  id: string;
  type: 'status_change' | 'comment' | 'royalty_payment' | 'submission';
  title: string;
  description: string;
  timestamp: string;
  relatedPaperId?: number;
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

  // Mock data for recent activities
  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'status_change',
      title: 'Paper Status Updated',
      description: 'Machine Learning Applications in Education has been accepted',
      timestamp: '2 hours ago',
      relatedPaperId: 1,
    },
    {
      id: '2',
      type: 'royalty_payment',
      title: 'Royalty Payment Received',
      description: 'You received 5,000,000 VND for Digital Transformation in Manufacturing',
      timestamp: '1 day ago',
      relatedPaperId: 2,
    },
    {
      id: '3',
      type: 'comment',
      title: 'New Comment',
      description: 'Dr. Lisa Nguyen commented on your paper Sustainable Energy Solutions',
      timestamp: '3 days ago',
      relatedPaperId: 3,
    },
  ]);

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

  // Helper function to get icon for activity type
  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'status_change':
        return 'sync-outline';
      case 'comment':
        return 'chatbubble-outline';
      case 'royalty_payment':
        return 'cash-outline';
      case 'submission':
        return 'paper-plane-outline';
      default:
        return 'information-circle-outline';
    }
  };

  // Helper function to get color for activity type
  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'status_change':
        return '#2196F3'; // Blue
      case 'comment':
        return '#4CAF50'; // Green
      case 'royalty_payment':
        return '#F27429'; // Orange (primary color)
      case 'submission':
        return '#9C27B0'; // Purple
      default:
        return '#9E9E9E'; // Grey
    }
  };

  // Helper function to format date and calculate days remaining
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleActivityPress = (activity: RecentActivity) => {
    if (activity.relatedPaperId) {
      // Navigate to the paper details
      navigateTo('RequestDetail', { requestId: activity.relatedPaperId });
    }
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
            <Text style={styles.userName}>Dr. Emily Smith</Text>
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

        {/* Recent Activity */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          
          {recentActivities.length > 0 ? (
            recentActivities.map(activity => (
              <TouchableOpacity 
                key={activity.id} 
                style={styles.activityCard}
                onPress={() => handleActivityPress(activity)}
              >
                <View style={[
                  styles.activityIconContainer, 
                  { backgroundColor: getActivityColor(activity.type) + '20' }
                ]}>
                  <Ionicons 
                    name={getActivityIcon(activity.type)} 
                    size={20} 
                    color={getActivityColor(activity.type)} 
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription} numberOfLines={2}>
                    {activity.description}
                  </Text>
                  <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="notifications-outline" size={40} color="#ccc" />
              <Text style={styles.emptyStateText}>No recent activity</Text>
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
  activityCard: {
    flexDirection: 'row',
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
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  activityTimestamp: {
    fontSize: 12,
    color: '#999',
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