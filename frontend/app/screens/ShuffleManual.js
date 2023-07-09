import React, { useState, useEffect, useContext,useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { useIsFocused } from '@react-navigation/native';
import Slider from "@react-native-community/slider";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPlay,
  faPause,
  faBackward,
  faForward,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";
import Constants from "expo-constants";
import { Audio } from "expo-av";
import LoadingContext from "../store/LoadingContext.js";
import colours from "../config/colours.js";
let songIndex =0;
const DEFAULT_SONG_INFO = {
  title: "Track Name",
  imgUri:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Square_gray.svg/1200px-Square_gray.svg.png",
};

const ShuffleManual = ({ route, navigation }) => {
  const { patient } = route.params;

  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [songInfo, setSongInfo] = useState(DEFAULT_SONG_INFO);
  const [playset, setPlayset] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("0:00");
  const [isLooping, setIsLooping] = useState(false);
  // const [songIndex, setSongIndex] = useState();
  const [isSeeking, setIsSeeking] = useState(false);
  const [shouldPlayAtEndOfSeek, setShouldPlayAtEndOfSeek] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const isFocused = useIsFocused();

  const handleSlidingStart = () => {
    if (isPlaying) {
      setShouldPlayAtEndOfSeek(true);
    } else {
      setShouldPlayAtEndOfSeek(false);
    }
    setIsSeeking(true);
    setIsPlaying(false);
    audio.pauseAsync();
  };

  const handleSlidingComplete = async (value) => {
    const seekPositionMillis = value * duration;
    if (audio) {
      await audio.setPositionAsync(seekPositionMillis);
    }
    setIsSeeking(false);
    setPosition(seekPositionMillis);
    if (shouldPlayAtEndOfSeek) {
      setIsPlaying(true);
      audio.playAsync();
    }
  };

  useEffect(() => {
    getManualPlayset();
    if (!isFocused && audio) {
      audio.unloadAsync();
    }
  }, [isFocused]);

  const playSong = async (playset) => {
    setIsLoading(true);
  
    const track = await getNextTrack(playset);
    console.log(songIndex)
  
    const newSongInfo = {
      title: track.name,
      imgUri:
        "https://png.pngtree.com/background/20211217/original/pngtree-note-music-logo-watercolor-background-picture-image_1589075.jpg",
    };
  
    setSongInfo(newSongInfo);
    const youtubeUrl = `https://www.youtube.com/watch?v=${track.id}`;
    const data = await fetch(
      `${Constants.expoConfig.extra.apiUrl}/track/audio-url?videoUrl=${encodeURIComponent(
        youtubeUrl
      )}&patientId=${patient._id}`
    );
    const { audioURL } = await data.json();
  
    if (audio) {
      await audio.unloadAsync();
    }
  
    const { sound, status } = await Audio.Sound.createAsync({ uri: audioURL });
  
    sound.setOnPlaybackStatusUpdate((playbackStatus) => {
      if (playbackStatus.isLoaded && !isSeeking) {
        setPosition(playbackStatus.positionMillis);
        const min = Math.floor(playbackStatus.positionMillis / 60000);
        const sec = Math.floor(
          (playbackStatus.positionMillis % 60000) / 1000
        );
        setElapsedTime(`${min}:${sec < 10 ? "0" : ""}${sec}`);
      }
      if (playbackStatus.didJustFinish) {
        // The playback just finished, play the next song
        playSong(playset);
      }
    });
  
    setAudio(sound);
    setDuration(status.durationMillis);
    setElapsedTime("0:00");
    setIsLoading(false);
    setIsPlaying(true);
    await sound.playAsync(); // Start playing the song
  
  };
  

  const togglePlayPause = async () => {
    try {
      if (isPlaying) {
        await audio.pauseAsync();
      } else {
        const playbackStatus = await audio.playAsync();
        setPosition(playbackStatus.positionMillis);
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error(error);
    }
  };

  const getManualPlayset = async () => {
    try {
      const response = await fetch(
        `${Constants.expoConfig.extra.apiUrl}/patient/getmanual?id=${patient._id}`
      );
      const data = await response.json();
      console.log(data);
      setPlayset(data);
      playSong(data);
    } catch (error) {
      console.error('Error fetching manual playset:', error);
    }
  };
  

  const handleView = async () => {
    // Create a string of song names
    const songNames = playset
      .map((item, index) => `${index + 1}. ${item.name}`)
      .join("\n \n");

    // Show the alert
    Alert.alert(
      "Current Playset",
      songNames,
      [
        {
          text: "OK",
        },
      ],
      { cancelable: false }
    );
  };

  let isBack = false;

const getNextTrack = async (playset) => {
  if (playset && playset.length > 0) {
    // Update songIndex for next song if isBack is false, else for previous song
    if (isBack) {
      songIndex = songIndex > 0 ? songIndex - 1 : playset.length - 1;
      isBack = false; // reset isBack flag
    } else {
      songIndex = songIndex < playset.length - 1 ? songIndex + 1 : 0;
    }
    console.log("in track"+songIndex)
    const nextTrack = playset[songIndex];
    return nextTrack;
  } else {
    return null;
  }
};

const prevSong = ()=>{
  isBack = true; // set isBack flag
  setIsPlaying(false);
  if (audio) {
    audio.stopAsync().then(() => playSong(playset));
  }
}

  const progress = position / duration || 0;

  return (
    <View style={styles.container}>
     {/* <BackButton navigation={navigation} onClick={
          async () => {
              if (audio) {
                  await audio.unloadAsync();
              }
          }
      } /> */}
    <StatusBar backgroundColor={colours.bg} barStyle="dark-content" />
    <View style={styles.topContainer}>
    <Text style={styles.title}>Project FUXI</Text>
    <View style={styles.musicInfoContainer}>
    <Image
    style={styles.coverImage}
    source={{ uri: songInfo.imgUri }}
    />
    <Text style={styles.songName} numberOfLines={1}>
    {songInfo.title}
    </Text>
    <View style={styles.progressBarContainer}>
    </View>
    <View style={styles.ratingContainer}>
    <TouchableOpacity
    style={styles.button}
    onPress={() => {prevSong()}}
    >
    <FontAwesomeIcon icon={faBackward} size={20} />
    </TouchableOpacity>
    <TouchableOpacity
    style={styles.button}
    onPress={togglePlayPause}
    >
    <FontAwesomeIcon
    icon={isPlaying ? faPause : faPlay}
    size={20}
    />
    </TouchableOpacity>
    <TouchableOpacity
    style={styles.button}
    onPress={async () => {
      setIsPlaying(false);
      if (audio) {
        await audio.stopAsync();
      }
      playSong(playset);
    }}
    >
    <FontAwesomeIcon icon={faForward} size={20} />
    </TouchableOpacity>
    
    </View>
    
    <Text></Text>
    
    <Text></Text>
  
    </View>
    </View>
    <View style={styles.progressBarContainer}>
      <Text style={styles.elapsedTime}>{elapsedTime}</Text>
      <Slider
        style={styles.slider}
        value={progress}
        onSlidingStart={handleSlidingStart}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor={colours.primary}
        maximumTrackTintColor={colours.secondary}
        thumbTintColor={colours.primary}
      />
    </View>
    
    <View style={styles.bottomContainer}>
    <TouchableOpacity
    style={{
    backgroundColor: colours.primary,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
    }}
    onPress={() => {
    handleView();
    }}
    >
    <Text style={{ color: 'white', fontSize: 10, padding:10 }}>View Current Playset</Text>
    </TouchableOpacity>
    </View>
    </View>
    );
    }
    
    
    const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: colours.bg,
    paddingHorizontal: 20,
    },
    topContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 130,
    },
    title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colours.primaryText,
    marginBottom: 20,
    },
    musicInfoContainer: {
    alignItems: "center",
    },
    coverImage: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginBottom: 20,
    },
    songName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colours.primaryText,
    marginTop: 10,
    },
    progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    },
    elapsedTime: {
    fontSize: 14,
    color: colours.primaryText,
    paddingHorizontal: 8,
    },
    button: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    },
    progressBar: {
    flex: 1,
    height: 5,
    backgroundColor: colours.secondary,
    borderRadius: 3,
    marginRight: 10,
    },
    progressBarFill: {
    backgroundColor: colours.primary,
    borderRadius: 3,
    },
    playPauseButton: {
    alignSelf: "center",
    marginBottom: 30,
    },
    bottomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 120,
    },
    sliderContainer: {
    alignItems: "center",
    },
    slider: {
    flex: 1,
    marginRight: 10,
    },
    ratingSlider: {
    width: 300,
    marginBottom: 10,
    },
    sliderValues: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    },
    sliderValue: {
    fontSize: 12,
    color: "gray",
    },
    ratingText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    },
    ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "80%",
    marginTop: 10,
    marginBottom: 20,
    marginLeft:22,
    backgroundColor: colours.bg,
    borderRadius: 25,
    paddingVertical: 5,
    },
    loopText: {
    fontSize: 16,
    marginTop: 10,
    color: colours.primaryText,
    },
    });
    
  

export default ShuffleManual;