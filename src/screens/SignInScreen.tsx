import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Dùng để điều hướng
import { DrawerNavigationProp } from '@react-navigation/drawer'; // Import DrawerNavigationProp
import { InputField } from '../components/InputField';
import { SignInFormData } from './types';

// Tạo kiểu cho navigation sử dụng DrawerNavigator
type SignInScreenNavigationProp = DrawerNavigationProp<any, 'AppDrawer'>;

export const SignInScreen: React.FC = () => {
  const [formData, setFormData] = React.useState<SignInFormData>({
    email: '',
    password: '',
  });

  const navigation = useNavigation<SignInScreenNavigationProp>(); // Dùng kiểu điều hướng cho Drawer

  const handleInputChange = (field: keyof SignInFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = () => {
    if (formData.email === 'admin' && formData.password === 'admin') {
      navigation.navigate('AppDrawer'); // Điều hướng đến DrawerNavigator (AppDrawer)
    } else {
      alert('Invalid credentials');
    }
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

        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign in</Text>
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
  formContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  title: {
    color: '#F27429',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '700',
  },
  form: {
    width: '80%',
    marginTop: 30,
  },
  signInButton: {
    backgroundColor: '#F27429',
    borderRadius: 16,
    marginTop: 25,
    width: '60%',
    paddingVertical: 11,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
