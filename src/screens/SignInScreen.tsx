import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { InputField } from './InputField';
import { SignInFormData } from './types';

const { width, height } = Dimensions.get('window'); // Lấy kích thước màn hình

export const SignInScreen: React.FC = () => {
  const [formData, setFormData] = React.useState<SignInFormData>({
    email: '',
    password: '',
  });

  const handleInputChange = (field: keyof SignInFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = () => {
    
  };

  return (
    <SafeAreaView style={styles.container}>


      <View style={styles.formContainer}>
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

        <TouchableOpacity 
          onPress={() => {}}
          accessibilityRole="button"
        >
          <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signInButton}
          onPress={handleSignIn}
          accessibilityRole="button"
        >
          <Text style={styles.signInButtonText}>Sign in</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Image
          resizeMode="contain"
          source={require('../../assets/google_signin.png')}
          style={styles.socialLoginImage}
          accessibilityLabel="Social login options"
        />

        <TouchableOpacity 
          onPress={() => {}}
          accessibilityRole="button"
        >
          <Text style={styles.signUpText}>
            You don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: '100%', 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.01, 
    minHeight: 36,
  },
  timeText: {
    fontFamily: 'Roboto',
    fontSize: width * 0.04, 
    fontWeight: '500',
    color: '#1D1B20',
  },
  headerImage: {
    width: 46,
    aspectRatio: 2.7,
  },
  banner: {
    minHeight: height * 0.3,
    width: '100%',
  },
  formContainer: {
    marginTop: height * 0.05, 
    paddingHorizontal: width * 0.13, 
    alignItems: 'center',
  },
  title: {
    color: '#F27429',
    fontSize: width * 0.08, 
    fontFamily: 'Roboto',
    fontWeight: '700',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginTop: 30,
  },
  forgotPassword: {
    color: '#000000',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '200',
    marginTop: "0.1%",
    marginLeft: "50%",
  },
  signInButton: {
    backgroundColor: '#F27429',
    borderRadius: 16,
    marginTop: 25,
    width: width * 0.6, 
    paddingVertical: 11,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.05, 
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 19,
    width: 212,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#5E5555',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '700',
  },
  socialLoginImage: {
    width: width * 0.5,
    aspectRatio: 5.13,
    marginTop: 10,
  },
  signUpText: {
    color: '#000000',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '200',
    marginTop: 30,
  },
});
