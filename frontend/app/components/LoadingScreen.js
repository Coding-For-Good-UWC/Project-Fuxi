import React from "react";
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  Animated
} from "react-native";

function LoadingScreen({ fadeAnim }) {
  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      <ActivityIndicator
        style={styles.loadingIcon}
        size="large"
        color="#ffffff"
        animating={true}
      />
      <Text style={styles.text}>Loading</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Black with 80% opacity
    zIndex: 1000, // Make sure the loading screen is on top of all other components
  },
  loadingIcon: {
    marginBottom: 10, // Add some space between the icon and the text
  },
  text: {
    color: 'white', // Set the text color to white
    fontSize: 18, // Set the font size (optional)
  }
});

export default LoadingScreen;
