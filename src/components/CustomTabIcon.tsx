import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CustomTabIconProps = {
  focused: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
};

const CustomTabIcon: React.FC<CustomTabIconProps> = ({ focused, iconName, label }) => {
  const { width } = useWindowDimensions();
  const iconSize = width * 0.06; // Responsive icon size
  const fontSize = width * 0.035; // Responsive text size

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
        <Ionicons name={iconName} size={iconSize} color={focused ? "#6200ea" : "#999"} />
      </View>
      <Text style={[styles.label, focused && styles.labelActive, { fontSize }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 70, // Điều chỉnh chiều rộng để các icon không bị lệch
    height: 70, // Đảm bảo chiều cao đồng nhất
  },
  iconWrapper: {
    backgroundColor: "transparent",
    borderRadius: 30,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapperActive: {
    backgroundColor: "#e0e0ff",
  },
  label: {
    color: "#999",
    textAlign: "center",
    marginTop: 4, // Tạo khoảng cách hợp lý giữa icon và chữ
  },
  labelActive: {
    color: "#6200ea",
    fontWeight: "bold",
  },
});

export default CustomTabIcon;
