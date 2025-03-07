import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { DrawerNavigationProp } from '@react-navigation/drawer'; 
import { InputField } from '../components/InputField';
import { SignInFormData } from './types';

type SignInScreenNavigationProp = DrawerNavigationProp<any, 'AppDrawer'>;

export const SignInScreen: React.FC = () => {
  const [formData, setFormData] = React.useState<SignInFormData>({
    email: '',
    password: '',
  });

  const navigation = useNavigation<SignInScreenNavigationProp>();

  const handleInputChange = (field: keyof SignInFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = () => {
    if (formData.email === 'admin' && formData.password === 'admin') {
      navigation.navigate('AppDrawer');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleGoogleSignIn = () => {
    alert('Google Sign-In pressed');
    // Your logic for Google sign-in here
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.formContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top logo/title */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>LRMS</Text>
        </View>

        {/* Centered form */}
        <Text style={styles.title}>Sign in</Text>

        <View style={styles.form}>
          <InputField
            label="Email"
            id="email"
            value={formData.email}
            onChange={handleInputChange('email')}
          />
          <InputField
            label="Password"
            id="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
          />
        </View>

        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign in</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* Bottom Google sign-in button */}
      <View style={styles.googleButtonContainer}>
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <Image
            source={require('../../assets/google_signin.png')}
            style={styles.googleButtonImage}
            resizeMode="contain"
          />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20, 
  },
  logoContainer: {
    marginTop: 40,
  },
  logoText: {
    fontSize: 36, 
    fontWeight: '700',
    color: '#F27429',
  },
  formContainer: {
    width: '100%',
    paddingVertical: 20, 
    justifyContent: 'center',
  },
  title: {
    color: '#F27429',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    width: '100%',
    marginBottom: 25, // Adjusted space between form and sign in button
  },
  signInButton: {
    backgroundColor: '#F27429',
    borderRadius: 16,
    marginTop: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  googleButtonContainer: {
    marginBottom: 40, // Extra space at the bottom to make it more balanced
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: 250, // Adjust width
    height: 50, // Increase height for better tap area
  },
  googleButtonImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  googleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4285F4',
  },
});

export default SignInScreen;
