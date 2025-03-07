import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const PendingRequestScreen: React.FC = () => {
  const navigation = useNavigation();
  
  // Sample data for pending requests
  const [requests] = useState([
    { id: '1', name: 'Research Paper 1', status: 'Pending' },
    { id: '2', name: 'Research Paper 2', status: 'Under Review' },
    { id: '3', name: 'Research Paper 3', status: 'Approved' },
  ]);

  // Navigate to create a new request screen
  const handleCreateNewRequest = () => {
    navigation.navigate('CreateNewRequest');
  };

  return (
    <View style={styles.container}>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.requestTitle}>{item.name}</Text>
            <Text style={styles.requestStatus}>{item.status}</Text>
          </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  requestItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  requestStatus: {
    fontSize: 14,
    color: '#888',
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
  },
  floatingButtonText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: '600',
  },
});

export default PendingRequestScreen;
