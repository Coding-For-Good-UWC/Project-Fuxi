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

  const [isFirstPlay, setIsFirstPlay] = useState (true); 

  const pauseHandler = async () => 
  {
    if (isFirstPlay)
      voteHandler (0); 

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

  const onPlaybackStatusUpdate = async() => 
  {
    if (!sound)
      return; 

    const status = await sound.getStatusAsync(); 
    console.log (status.positionMillis); 
  }

  const voteHandler = (pscore) => 
  {
    //TODO - avoid spamming before response
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
        console.log (response.data); 

        const audio = response.data.uri; 
        currentlyPlaying = response.data.id; 

        console.log('Loading Sound'); 
        console.log (audio); 

        const { sound } = await Audio.Sound.createAsync(audio); 
        // console.log (sound); 
        // const status = await sound.getStatusAsync(); 
        // console.log (status); 
        setSound(sound);
        
        await sound.playAsync(); 
        setIsPlaying (true); 
        sound.setOnPlaybackStatusUpdate (onPlaybackStatusUpdate); 

        // const playbackStatus = await sound.getStatusAsync(); 
        // playbackStatus.positionMillis; 
      }
    }

    // try 
    // {
      getSong (isFirstPlay ? 0 : pscore); 
      setIsFirstPlay (false); 
    // } catch (e) 
    // {
    //   console.log ("ERROR"); 
    //   console.error(e);
    // } 
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topContainer, styles.card]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Project FUXI</Text>
        </View>
        <View style={styles.musicInfoContainer}>
          <View style={styles.coverImageContainer}>
            <Image style={styles.coverImage} source={require("../assets/tempMusicCover.jpeg")} />
          </View>
          <View style={styles.playerContainer}>
            <View style={styles.songNameContainer}>
              <Text style={styles.songName}>Song Name - Artist Name</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={styles.progressBarFill}></View>
              </View>

              <TouchableOpacity style={styles.playPauseButton} onPress={pauseHandler}>
                <FontAwesomeIcon icon={ isPlaying ? faPause : faPlay } size={20} style={{paddingLeft: "5%"}} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.bottomContainer, styles.card]}>
        <TouchableOpacity style={[styles.voteUpButton, styles.voteButton]} onPress={() => voteHandler(1)}>
          <FontAwesomeIcon icon={ faThumbsUp } size={55} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.skipButton, styles.voteButton]} onPress={() => voteHandler(1)}>
          <FontAwesomeIcon icon={ faFastForward } size={55} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.voteDownButton, styles.voteButton]} onPress={() => voteHandler(-1)}>
          <FontAwesomeIcon icon={ faThumbsDown } size={55} />
        </TouchableOpacity>
      </View>
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
    paddingLeft: "10%", 
    paddingRight: "10%", 
    paddingTop: "7%", 
    paddingBottom: "7%", 
    width: "100%", 
  }, 
  card: 
  {
    backgroundColor: colours.charcoal, 
    borderRadius: 15, 
    shadowColor: 'black',
    shadowOffset: { width: 10, height: 15 },
    shadowRadius: 5,
    shadowOpacity: 0.3, 
    paddingLeft: "4%", 
    paddingRight: "4%", 
    paddingTop: "2%", 
    paddingBottom: "2%", 
    width: "100%", 
    height: "100%", 
    marginBottom: "2%", 
  }, 
  topContainer: 
  {
    flex: 1.7, 
    justifyContent: 'center', 
    alignItems: "center", 
    flexDirection: 'column', 
  }, 

  titleContainer: 
  {
    flex: 0.2
  }, 
  title: 
  {
    color: colours.text, 
    fontSize: 45, 
    fontWeight: 'bold', 
    marginBottom: 20
  }, 

  musicInfoContainer: 
  {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    // backgroundColor: 'green', 
    width: "100%", 
    marginLeft: "1%", 
    marginRight: "1%", 
  }, 
  
  coverImageContainer: 
  {
    flex: 1, 
    // backgroundColor: 'blue'
  }, 
  coverImage: 
  {
    height: "70%", 
    aspectRatio: 1, 
    borderRadius: 20, 
  }, 

  playerContainer: 
  {
    flex: 5, 
    flexDirection: 'column', 
  }, 

  songNameContainer: 
  {
    flex: 1
  }, 
  songName: 
  {
    color: colours.text, 
    fontSize: 35, 
    fontWeight: 'bold', 
    marginBottom: 20
  }, 

  progressContainer: 
  {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center'
  }, 
  playPauseButton: 
  {
    width: 32, 
    height: 32, 
    borderRadius: '100%', 
    backgroundColor: 'lightgrey', 
    justifyContent: 'center', 
    alignItems: 'center', 
    margin: 15, 
    backgroundColor: "#3c6e71"
  }, 
  progressBar: 
  {
    backgroundColor: colours.bg, 
    width: "40%", 
    height: 18, 
    borderRadius: 25
  }, 
  progressBarFill: 
  {
    backgroundColor: 'white', 
    width: "40%", 
    height: "100%", 
    borderRadius: 25
  }, 




  bottomContainer: 
  {
    flex: 1, 
    justifyContent: 'center', 
    flexDirection: 'row', 
  }, 
  voteButton: 
  {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: "center", 
    borderRadius: 10, 
    marginLeft: "1%", 
    marginRight: "1%", 
    shadowColor: 'black',
    shadowOffset: { width: 10, height: 15 },
    shadowRadius: 5,
    shadowOpacity: 0.1, 
  }, 
  voteUpButton: 
  {
    backgroundColor: "#52b952", 
  }, 
  skipButton: 
  {
    backgroundColor: colours.text, 
  }, 
  voteDownButton: 
  {
    backgroundColor: "#ec5a5a", 
  }
});

export default PlayerScreen;