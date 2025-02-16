import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import AppDrawer from "./AppDrawer";

const Stack = createStackNavigator();
const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="AppDrawer" component={AppDrawer} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
