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
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
    zIndex: 1000, 
  },
  loadingIcon: {
    marginBottom: 10, 
  },
  text: {
    color: 'white', 
    fontSize: 18, 
  }
});

export default LoadingScreen;
