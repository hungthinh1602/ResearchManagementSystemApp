import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import RequestsScreen from "../screens/RequestsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProjectScreen from "../screens/ProjectScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  // Mock notification count
  const unreadNotifications = 10;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          marginBottom: 3,
        },
        tabBarStyle: {
          position: "absolute",
          height: 60,
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 10,
          elevation: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Projects") {
            iconName = focused ? "folder" : "folder-outline";
          } else if (route.name === "Requests") {
            iconName = focused ? "document-text" : "document-text-outline";
          } else if (route.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else {
            iconName = "help-circle";
          }

          return (
            <View style={{ position: 'relative' }}>
              <Ionicons name={iconName} size={size} color={focused ? "#F27429" : "#8E8E93"} />
              {route.name === "Notifications" && unreadNotifications > 0 && (
                <View style={{
                  position: 'absolute',
                  top: -5,
                  right: -8,
                  backgroundColor: '#FF3B30',
                  borderRadius: 10,
                  minWidth: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 4,
                  borderWidth: 1.5,
                  borderColor: '#FFFFFF',
                }}>
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 9,
                    fontWeight: 'bold',
                  }}>
                    {unreadNotifications > 99 ? '99+' : unreadNotifications}
                  </Text>
                </View>
              )}
            </View>
          );
        },
        tabBarActiveTintColor: "#F27429",
        tabBarInactiveTintColor: "#8E8E93",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Projects" component={ProjectScreen} />
      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
