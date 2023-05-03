import React from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";

function LoadingScreen(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading</Text>
    </View>
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
      zInde: 1000, // Make sure the loading screen is on top of all other components
    },
    text: {
      color: 'white', // Set the text color to white
      fontSize: 18, // Set the font size (optional)
    }
  });
  

export default LoadingScreen;
