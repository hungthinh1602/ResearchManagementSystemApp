import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Dummy Screens for Navigation (Replace these with actual screens)
const DashboardScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Dashboard Screen</Text>
  </View>
);
const ResearchRegistrationScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Research Registration Screen</Text>
  </View>
);

// Stack and Drawer Navigators
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Stack Navigator for Sign In / Sign Up
function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// Drawer Navigator for Home
function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true, // Hiển thị header để có thể đặt nút menu
        drawerActiveBackgroundColor: '#F27429',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#000',
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
              <Text style={styles.menuButtonText}>☰</Text> {/* Icon menu */}
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Research Registration" component={ResearchRegistrationScreen} />
    </Drawer.Navigator>
  );
}

// Navigation Container for Whole App
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="AppDrawer" component={AppDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  menuButton: {
    marginRight: 15,
    padding: 10,
  },
  menuButtonText: {
    fontSize: 24, // Tăng kích thước icon menu
    color: '#000',
  },
});

