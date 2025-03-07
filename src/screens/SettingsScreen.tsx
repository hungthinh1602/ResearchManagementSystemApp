import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './types';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const handleAboutPress = () => {
    navigation.navigate('About');  // Now TypeScript should recognize this as valid
  };

  const handleLogOut = () => {
    alert('Logging out...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Settings options */}
      <TouchableOpacity style={styles.option} onPress={handleAboutPress}>
        <Text style={styles.optionText}>About</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={handleLogOut}>
        <Text style={styles.optionText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333333',
  },
  option: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#333333',
  },
});

export default SettingsScreen;
