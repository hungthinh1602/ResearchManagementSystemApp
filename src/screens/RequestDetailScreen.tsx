import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from './types';

type RequestDetailRouteProp = RouteProp<RootStackParamList, 'RequestDetail'>;

const RequestDetailScreen: React.FC = () => {
  const route = useRoute<RequestDetailRouteProp>();
  const navigation = useNavigation();
  
  // Add null check for route.params and request
  const request = route.params?.request;

  // If request is undefined, show a fallback UI
  if (!request) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#F27429" />
        <Text style={styles.errorText}>Research paper details not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Research Details</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{request.title}</Text>
        <Text style={styles.abstract}>{request.abstract}</Text>
        
        {/* Add more details as needed */}
        <Text style={styles.sectionTitle}>Status: {request.status}</Text>
        <Text style={styles.sectionTitle}>Type: {request.type}</Text>
        <Text style={styles.sectionTitle}>Publisher: {request.publisher}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    color: '#F27429',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  abstract: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
});

export default RequestDetailScreen; 