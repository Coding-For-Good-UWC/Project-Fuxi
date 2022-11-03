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

var currentlyPlaying = -1; 

function PlayerScreen ({ navigation }) 
{
  const [sound, setSound] = useState (); 
  const [isPlaying, setIsPlaying] = useState (false); 

  useEffect (() => 
  {
    voteHandler (0)(); 
  }, [])

  const pauseHandler = async () => 
  {
    if (!sound)
      return; 

    if (isPlaying)
      await sound.pauseAsync(); 
    else
      await sound.playAsync (); 

    console.log (isPlaying ? "PAUSED" : "UNPAUSED"); 
    
    setIsPlaying (!isPlaying); 
  }

  useEffect(() => {
    return sound ? () => 
    {
        console.log('Unloading Sound');
        sound.unloadAsync();
    } : undefined;
  }, [sound]);

  const voteHandler = (pscore) => 
  {
    return async() => 
    {
      console.log(currentlyPlaying)
      let response = await fetch('http://localhost:8080/v1/user_preferences/new', {
        method: 'POST',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(
        {
          "user_id": 1, 
          "song_id": currentlyPlaying, 
          "score": pscore, 
        })
      }).then(res => res.json())
      
      if (response.status !== 'ok') alert(response.error_message)
      else
      {
        const audio = response.data.uri; 
        currentlyPlaying = response.data.id; 

        console.log('Loading Sound'); 
        console.log (audio); 

        const { sound } = await Audio.Sound.createAsync(audio); 
        setSound(sound);

        await sound.playAsync();        
        setIsPlaying (true); 
      }
    }
  }


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.voteUpContainer} onPress={() => voteHandler(1)()}>
        <FontAwesomeIcon icon={ faThumbsUp } size={55} />
      </TouchableOpacity>
      <View style={styles.voteSkipContainer}>
        <TouchableOpacity style={styles.buttonBg} onPress={pauseHandler}>
          <FontAwesomeIcon icon={ isPlaying ? faPause : faPlay } size={55} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonBg} onPress={() => voteHandler(0)()}>
          <FontAwesomeIcon icon={ faFastForward } size={55} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.voteDownContainer} onPress={() => voteHandler(-1)()}>
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