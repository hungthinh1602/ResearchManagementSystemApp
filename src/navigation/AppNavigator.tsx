import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./AuthNavigator";
import AppDrawer from "./AppDrawer";
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AboutScreen from '../screens/AboutScreen';
import CreateNewRequest from '../screens/CreateNewRequest';
import RequestDetailScreen from '../screens/RequestDetailScreen';
import { RootStackParamList } from '../screens/types';
import { ProjectDetailScreen } from '../screens/ProjectDetailScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="AppDrawer" component={AppDrawer} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="CreateNewRequest" component={CreateNewRequest} />
      <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
      <Stack.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={{
          title: 'Project Details',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
