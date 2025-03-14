import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';

type CreateNewRequestNavigationProp = StackNavigationProp<RootStackParamList>;

interface RequestForm {
  title: string;
  description: string;
  type: string;
  expectedDuration: string;
}

export const CreateNewRequest: React.FC = () => {
  const navigation = useNavigation<CreateNewRequestNavigationProp>();
  const [formData, setFormData] = useState<RequestForm>({
    title: '',
    description: '',
    type: '',
    expectedDuration: '',
  });

  const handleInputChange = (field: keyof RequestForm) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('Submitting request:', formData);
    // Navigate back to the requests screen
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Create New Request</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={handleInputChange('title')}
              placeholder="Enter research title"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Type</Text>
            <TextInput
              style={styles.input}
              value={formData.type}
              onChangeText={handleInputChange('type')}
              placeholder="Research type"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Expected Duration</Text>
            <TextInput
              style={styles.input}
              value={formData.expectedDuration}
              onChangeText={handleInputChange('expectedDuration')}
              placeholder="Expected duration (in months)"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={handleInputChange('description')}
              placeholder="Enter research description"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#F27429',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateNewRequest; 