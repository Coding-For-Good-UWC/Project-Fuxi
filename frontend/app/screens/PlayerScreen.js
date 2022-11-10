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
  const [sound, setSound] = useState (null); 
  const [songPercentage, setSongPercentage] = useState (0); 
  const [isPlaying, setIsPlaying] = useState (false); 
  const [isFirstPlay, setIsFirstPlay] = useState (true); 
  const [isLoading, setIsLoading] = useState (false); 
  const [songInfo, setSongInfo] = useState ({
    title: 'Track Name', 
    imgUri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Square_gray.svg/1200px-Square_gray.svg.png'
  }); 

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

  useEffect(() => 
  {
    voteHandler (0); 
  }, [])

  useEffect(() => {
    return sound ? () => 
    {
        console.log('Unloading Sound');
        sound.unloadAsync();
    } : undefined;
  }, [sound]);

  const onPlaybackStatusUpdate = playbackStatus => {
    if (!playbackStatus.isLoaded) 
      return; 
    
    setSongPercentage ((playbackStatus.positionMillis / playbackStatus.durationMillis) * 100); 
  };

  const voteHandler = (pscore) => 
  {
    const getSong = async() => 
    {
      setIsLoading (true); 

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

        const newSongInfo = 
        {
          title: response.data.title + " - " + response.data.artist, 
          imgUri: response.data.img_uri
        }

        setSongInfo (newSongInfo); 

        const { sound } = await Audio.Sound.createAsync(audio); 
        setSound(sound);

        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        
        if (!isFirstPlay)
        { 
          setIsPlaying (true); 
          await sound.playAsync(); 
        }
      }

      setIsLoading (false); 
    }

    if (isLoading) 
    {
      console.log ("Already loading a song"); 
      return; 
    }
    getSong (isFirstPlay ? 0 : pscore); 
    if (isFirstPlay) setIsFirstPlay (false); 
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topContainer, styles.card]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Project FUXI</Text>
        </View>
        <View style={styles.musicInfoContainer}>
          <View style={styles.coverImageContainer}>
            <Image style={styles.coverImage} source={{uri: songInfo.imgUri}} />
            {/* <Image style={styles.coverImage} source={require("../assets/tempMusicCover.jpeg")} /> */}
          </View>
          <View style={styles.playerContainer}>
            <View style={styles.songNameContainer}>
              <Text style={styles.songName} numberOfLines={1}>{songInfo.title}</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressBarFill, {width: `${songPercentage}%`}]}></View>
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
    flex: 0.1, 
    // backgroundColor: 'orange'
  }, 
  title: 
  {
    color: colours.text, 
    fontSize: 45, 
    fontWeight: 'bold', 
    // marginBottom: 20, 
  }, 

  musicInfoContainer: 
  {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    // backgroundColor: 'green', 
    width: "100%", 
    // height: "80%", 
    paddingLeft: "15%", 
    paddingRight: "15%", 
    // backgroundColor: 'green'
  }, 
  
  coverImageContainer: 
  {
    flex: 1, 
    // backgroundColor: 'blue', 
  }, 
  coverImage: 
  {
    height: "70%", 
    aspectRatio: 1, 
    borderRadius: 20, 
  }, 

  playerContainer: 
  {
    marginLeft: '4%', 
    flex: 4, 
    flexDirection: 'column', 
    // backgroundColor: 'red', 
    height: "40%"
  }, 

  songNameContainer: 
  {
    flex: 1
  }, 
  songName: 
  {
    color: colours.text, 
    fontSize: 30, 
    fontWeight: 'bold', 
    marginBottom: 20
  }, 

  progressContainer: 
  {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
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
    backgroundColor: "#3c6e71", 
    position: 'absolute', 
    right: 0, 
    bottom: -2, 
  }, 
  progressBar: 
  {
    backgroundColor: colours.bg, 
    width: "90%", 
    height: 18, 
    borderRadius: 25
  }, 
  progressBarFill: 
  {
    backgroundColor: 'white', 
    // width: "40%", 
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