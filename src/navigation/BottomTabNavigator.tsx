import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";  // ✅ Không cần dấu {}
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import PendingRequestScreen from "../screens/PendingRequestScreen";
import CustomTabIcon from "../components/CustomTabIcon";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: 70,
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 10,
          elevation: 5,
        },
        tabBarIcon: ({ focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          let label: string;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
            label = "Home";
          } else if (route.name === "Requests") {
            iconName = focused ? "newspaper" : "newspaper-outline";
            label = "Requests";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
            label = "Profile";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
            label = "Settings";
          } else {
            return null;
          }

          return <CustomTabIcon focused={focused} iconName={iconName} label={label} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Requests" component={PendingRequestScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
