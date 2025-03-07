import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const AboutScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About</Text>
      <Text style={styles.aboutText}>
        This is the About Screen.
      </Text>
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
  aboutText: {
    fontSize: 16,
    color: '#333333',
  },
});

export default AboutScreen;
