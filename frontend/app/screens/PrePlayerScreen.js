import React, { useState, useEffect, useContext } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import BackButton from "../components/BackButton.js";

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    StatusBar,
} from "react-native";
import Slider from "@react-native-community/slider";
import {
    faPlay,
    faPause,
    faBackward,
    faForward,
    faRepeat,
    faThumbsDown
} from "@fortawesome/free-solid-svg-icons";

import { Audio } from "expo-av";
import LoadingContext from "../store/LoadingContext.js";
// import BackButton from "../components/BackButton.js";

import colours from "../config/colours.js";

function PrePlayerScreen({ route, navigation }) {
    const { patient } = route.params;
    console.log(patient);
    return (
      <View style={styles.container}>
        <BackButton navigation={navigation}/>
        <View style={styles.topContainer}>
          <Text style={styles.title}>How would you like to listen?</Text>
        </View>
        <View style={styles.bottomContainear}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ManualPlayer", { patient })}>
            <Text style={styles.buttonText}>Manual</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Player", { patient })}>
            <Text style={styles.buttonText}>Automatic</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  
  }
  const styles = StyleSheet.create({
    container: {
      flex: 0.75,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
    },
    topContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 24,
    },
    bottomContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    button: {
      backgroundColor: colours.primary,
      borderRadius: 15,
      paddingVertical: 32,
      paddingHorizontal: 32,
      marginBottom: 30,
      width:250
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 24,
      textAlign: "center",
    },
  });
  
      

export default PrePlayerScreen;
