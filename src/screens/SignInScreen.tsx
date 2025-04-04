import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Dimensions,
  StatusBar,
  Animated,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from './types';
import Constants from 'expo-constants';

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;

interface SignInFormData {
  email: string;
  password: string;
}

export const SignInScreen: React.FC = () => {
  const [formData, setFormData] = React.useState<SignInFormData>({
    email: '',
    password: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const navigation = useNavigation<SignInScreenNavigationProp>();

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [fadeAnim]);

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

  const handleForgotPassword = () => {
    // Handle forgot password
    alert('Forgot password functionality will be implemented soon');
  };

  const testApiConnection = async () => {
    try {
      console.log('Starting API test...');
      
      const API_URL = 'https://0b1c-2405-4802-a39c-9ba0-45e7-1ca4-ab59-c590.ngrok-free.app/api/auth/login';
      
      console.log('Connecting to:', API_URL);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": "lecturer1@example.com",
          "password": "12345"
        })
      });
      
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Format the response data for display
        const userInfo = data.user ? 
          `Thông tin người dùng:\n` +
          `- Email: ${data.user.email}\n` +
          `- Vai trò: ${data.user.role}\n` +
          `- ID: ${data.user.id}\n` +
          `- Tên: ${data.user.fullName || 'N/A'}`
          : 'Không có thông tin người dùng';

        Alert.alert(
          'Đăng nhập thành công ✅',
          `${userInfo}\n\n` +
          `Token: ${data.token?.substring(0, 50)}...`
        );
      } else {
        Alert.alert(
          'Đăng nhập thất bại ❌',
          data.message || 'Lỗi không xác định'
        );
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      Alert.alert(
        'Lỗi kết nối API ❌',
        'Không thể kết nối tới API. Vui lòng kiểm tra:\n\n' +
        '1. Đường dẫn API có hoạt động không?\n' +
        '2. Lỗi: ' + (error instanceof Error ? error.message : 'Không xác định')
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.contentContainer}>
          {/* Header with Logo */}
          <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
            <View style={styles.logoContainer}>
              <Ionicons name="library" size={60} color="#F27429" />
            </View>
            <Text style={styles.appName}>LRMS</Text>
            <Text style={styles.appTagline}>Literature Research Management System</Text>
          </Animated.View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitleText}>Sign in to continue</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={22} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={handleInputChange('email')}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={22} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!isPasswordVisible}
                value={formData.password}
                onChangeText={handleInputChange('password')}
              />
              <TouchableOpacity 
                style={styles.visibilityIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons 
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                  size={22} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signInButton}
              onPress={handleSignIn}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Footer with version */}
          <View style={styles.footerContainer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>

          <TouchableOpacity 
            style={styles.testButton} 
            onPress={testApiConnection}
          >
            <Text style={styles.testButtonText}>Test API Connection</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f5f5f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginVertical: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  visibilityIcon: {
    padding: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#F27429',
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: '#F27429',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F27429',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
  testButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  testButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SignInScreen;
