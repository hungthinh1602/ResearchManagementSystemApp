import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PendingRequestScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Pending Request Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default PendingRequestScreen;
