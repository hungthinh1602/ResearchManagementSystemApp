import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export const SignUpScreen: React.FC = () => {
  const [formData, setFormData] = React.useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (id: keyof FormData, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Tiêu đề Sign Up */}
      <Text style={styles.bannerText}>Sign up</Text>

      {/* Form nhập liệu */}
      <View style={styles.formContainer}>
        {['email', 'firstName', 'lastName', 'password', 'confirmPassword'].map((field, index) => (
          <TextInput
            key={index}
            placeholder={field.replace(/([A-Z])/g, ' $1').toUpperCase()} // Làm đẹp placeholder
            secureTextEntry={field.toLowerCase().includes('password')}
            value={formData[field as keyof FormData]} // Truy cập thuộc tính bằng cách sử dụng 'keyof FormData'
            onChangeText={(text) => handleInputChange(field as keyof FormData, text)} // Dùng 'keyof FormData'
            style={styles.inputField}
          />
        ))}
      </View>

      {/* Nút Create Account */}
      <TouchableOpacity style={styles.createAccountButton}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Điều hướng về trang đăng nhập */}
      <TouchableOpacity>
        <Text style={styles.signInText}>Already have an account? Sign In</Text>
      </TouchableOpacity>

      {/* Đăng nhập bằng Google - Đưa xuống cuối */}
      <View style={styles.googleLoginContainer}>
        <Image 
          resizeMode="contain" 
          source={require('../../assets/google_signin.png')} 
          style={styles.googleLoginImage} 
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  bannerText: {
    fontSize: 28,
    color: '#F27429',
    fontWeight: '700',
    marginBottom: 15,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputField: {
    width: '90%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  createAccountButton: {
    backgroundColor: '#F27429',
    borderRadius: 10,
    width: '90%',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  signInText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
    marginTop: 10,
  },
  googleLoginContainer: {
    marginTop: 20, 
  },
  googleLoginImage: {
    width: 200,
    height: 40,
  },
});

export default SignUpScreen;
