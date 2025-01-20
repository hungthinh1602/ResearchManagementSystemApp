import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { InputField } from './SignUpInputField';
import { SignUpFormData } from './types';

export const SignUpScreen: React.FC = () => {
  const [formData, setFormData] = React.useState<SignUpFormData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const formFields = [
    { id: 'email', label: 'Email', type: 'email' },
    { id: 'firstName', label: 'First Name' },
    { id: 'lastName', label: 'Last Name' },
    { id: 'password', label: 'Password', type: 'password' },
    { id: 'confirmPassword', label: 'Confirm Password', type: 'password' },
  ];

  const handleInputChange = (id: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.bannerContainer}>
          <Image
                    resizeMode="contain"
                    source={require('../../assets/google_signin.png')}
                  />
          <Text style={styles.bannerText}>Sign up</Text>
        </View>

        <View style={styles.formContainer}>
          {formFields.map((field) => (
            <InputField
                key={field.id}
                id={field.id}
                label={field.label}
                type={field.type}
                value={formData[field.id as keyof SignUpFormData]} // Dynamic access
                onChange ={handleInputChange}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.createAccountButton}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInContainer}>
          <Text style={styles.signInText}>
            You already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    maxWidth: 411,
    paddingBottom: 17,
    alignItems: 'center',
    fontFamily: 'Roboto',
  },
  header: {
    alignSelf: 'stretch',
    display: 'flex',
    minHeight: 36,
    paddingHorizontal: 24,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#1D1B20',
    letterSpacing: 0.14,
  },
  headerImage: {
    width: 46,
    aspectRatio: 2.7,
  },
  bannerContainer: {
    width: '100%',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    aspectRatio: 2.02,
  },
  bannerText: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    fontSize: 32,
    color: '#F27429',
    fontWeight: '700',
    letterSpacing: 0.32,
  },
  formContainer: {
    marginTop: 30,
    width: '100%',
    maxWidth: 300,
    gap: 20,
  },
  createAccountButton: {
    alignSelf: 'stretch',
    backgroundColor: '#F27429',
    borderRadius: 16,
    marginTop: 24,
    minHeight: 42,
    width: 229,
    maxWidth: '100%',
    padding: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  signInContainer: {
    marginTop: 87,
  },
  signInText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '200',
    letterSpacing: 0.12,
  },
});