import React, { useState, useEffect } from "react";
import 
{
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    TouchableOpacity, 
    Platform
  } from "react-native";

  import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
  import { faThumbsUp, faThumbsDown, faPause, faFastForward, faPlay } from '@fortawesome/free-solid-svg-icons/'

import { Audio } from 'expo-av';

import colours from '../config/colours.js'; 

function PlayerScreen ({ navigation }) 
{
  const [sound, setSound] = useState (); 
  
  const playHandler = async() =>
  {
      console.log('Loading Sound'); 

      const response = await fetch ('http://localhost:8080/v1/song/info/0', 
      {
        credentials: 'include', 
        method: "GET", 
      }).then (res => res.json()); 
      
      // const response = await fetch ('https://samplelib.com/lib/preview/mp3/sample-6s.mp3'); 

      const audio = response.data.spotify_uri; 

      const { sound } = await Audio.Sound.createAsync(audio); 
      setSound(sound);

      await sound.playAsync();
  }

  const pauseHandler = async () => 
  {
    if (!sound)
      return; 

    console.log ("PAUSE"); 
    await sound.pauseAsync(); 
  }

  useEffect(() => {
    return sound ? () => 
    {
        console.log('Unloading Sound');
        sound.unloadAsync();
    } : undefined;
  }, [sound]);
  
  const skipHandler = () => 
  {
    console.log ("SKIP"); 
    // TrackPlayer.skipToNext(); 
  }

  const voteUpHandler = () => 
  {
    console.log ("VOTE UP"); 
    // skipHandler (); 
  }

  const voteDownHandler = () => 
  {
    console.log ("VOTE DOWN"); 
    // skipHandler (); 
  }

  return (
    <View style={styles.container}>
      {/* <audio controls autoPlay>
        <source src="../assets/temp-track-1" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio> */}
      <TouchableOpacity style={styles.voteUpContainer} onPress={voteUpHandler}>
        <FontAwesomeIcon icon={ faThumbsUp } size={55} />
      </TouchableOpacity>
      <View style={styles.voteSkipContainer}>
        <TouchableOpacity style={styles.buttonBg} onPress={playHandler}>
          <FontAwesomeIcon icon={ faPlay } size={55} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonBg} onPress={pauseHandler}>
          <FontAwesomeIcon icon={ faPause } size={55} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonBg} onPress={skipHandler}>
          <FontAwesomeIcon icon={ faFastForward } size={55} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.voteDownContainer} onPress={voteDownHandler}>
        <FontAwesomeIcon icon={ faThumbsDown } size={55} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create
({
  container: 
  {
    flex: 1, 
    backgroundColor: colours.bg, 
    flexDirection: 'column', 
  }, 
  voteUpContainer: 
  {
    flex: 1, 
    backgroundColor: "green", 
    justifyContent: 'center', 
    alignItems: "center"
  }, 
  voteSkipContainer: 
  {
    flex: 0.7, 
    justifyContent: 'center', 
    alignItems: "center", 
    flexDirection: 'row', 
  }, 
  voteDownContainer: 
  {
    flex: 1, 
    backgroundColor: "red", 
    justifyContent: 'center', 
    alignItems: "center"
  }, 
  buttonBg: 
  {
    width: 110, 
    height: 110, 
    borderRadius: '100%', 
    backgroundColor: 'lightgrey', 
    justifyContent: 'center', 
    alignItems: 'center', 
    margin: 15
  }
});

export default PlayerScreen;