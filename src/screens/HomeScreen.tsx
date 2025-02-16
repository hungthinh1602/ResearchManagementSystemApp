import * as React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer'; // Dùng DrawerScreenProps

// Định nghĩa kiểu cho HomeScreen
type HomeScreenProps = DrawerScreenProps<any, 'Home'>; // Thay 'any' bằng kiểu chi tiết nếu cần

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen</Text>

      {/* Các nút điều hướng */}
      <Button title="Go to Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      <Button title="Go to Research Registration" onPress={() => navigation.navigate('ResearchRegistration')} />
      <Button title="Logout" onPress={() => alert('Logged out')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
export default HomeScreen;