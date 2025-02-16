import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CustomTabIconProps = {
  focused: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
};

const CustomTabIcon: React.FC<CustomTabIconProps> = ({ focused, iconName, label }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
        <Ionicons
          name={iconName}
          size={24}
          color={focused ? "#6200ea" : "#999"}
        />
      </View>
      <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    backgroundColor: "transparent",
    borderRadius: 50,
    padding: 8,
  },
  iconWrapperActive: {
    backgroundColor: "#e0e0ff",
  },
  label: {
    fontSize: 12,
    color: "#999",
  },
  labelActive: {
    color: "#6200ea",
    fontWeight: "bold",
  },
});

export default CustomTabIcon;
