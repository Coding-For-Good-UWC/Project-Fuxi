import React, { useEffect } from "react";
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
  import { faThumbsUp, faThumbsDown, faPause, faFastForward } from '@fortawesome/free-solid-svg-icons/'

import colours from '../config/colours.js'; 

// import TrackPlayer from "react-native-track-player"; 

// const tracks = [
//   {
//     id: 1, 
//     url: require ('../assets/temp-track-1.mp3'), 
//     title: "Track 1"
//   }, 
//   {
//     id: 2, 
//     url: require ('../assets/temp-track-2.mp3'), 
//     title: "Track 2"
//   }, 
//   {
//     id: 3, 
//     url: require ('../assets/temp-track-3.mp3'), 
//     title: "Track 3"
//   }
// ]

// TrackPlayer.updateOptions ({
//   stopWithApp: false, 
//   capabilities: [
//     TrackPlayer.CAPABILITY_PLAY, 
//     TrackPlayer.CAPABILITY_PAUSE
//   ], 
//   compactCapabilities: [
//     TrackPlayer.CAPABILITY_PLAY, 
//     TrackPlayer.CAPABILITY_PAUSE
//   ], 
// })

function PlayerScreen ({ navigation }) 
{
  // const setupPlayer = async () => 
  // {
  //   try
  //   {
  //     await TrackPlayer.setupPlayer(); 
  //     await TrackPlayer.add(tracks); 
  //   }
  //   catch (e)
  //   {
  //     console.log (e); 
  //   }
  // }

  // useEffect (() => 
  // {
  //   setupPlayer(); 

  //   return () => TrackPlayer.destroy(); 
  // }, []); 

  const pauseHandler = () => 
  {
    console.log ("PAUSE"); 
    // TrackPlayer.pause(); 
  }
  
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