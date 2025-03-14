import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { navigationRef } from './navigation/navigationRef';

const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App; 