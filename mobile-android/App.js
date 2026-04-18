import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function App() {
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const onPrimaryActionPress = () => {
    setIsMessageVisible(true);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={onPrimaryActionPress}
        accessibilityRole="button"
        accessibilityLabel="Show hello world"
      >
        <Text style={styles.buttonLabel}>Show hello world</Text>
      </Pressable>
      {isMessageVisible ? (
        <Text style={styles.message} accessibilityLiveRegion="polite">
          hello world
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 24,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#2563eb",
    borderRadius: 8,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonLabel: {
    color: "#ffffff",
    fontSize: 16,
  },
  message: {
    fontSize: 18,
  },
});
