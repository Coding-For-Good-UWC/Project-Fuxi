import React, { useState, useEffect, useContext, useRef} from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    StatusBar,
} from "react-native";
import Slider from '@react-native-community/slider';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
    faPlay,
    faPause,
    faBackward,
    faForward,
    faRepeat,
} from "@fortawesome/free-solid-svg-icons";
import Constants from 'expo-constants'

import { Audio } from "expo-av";
import LoadingContext from "../store/LoadingContext.js";
import BackButton from "../components/BackButton.js";

import colours from "../config/colours.js";

const DEFAULT_SONG_INFO = {
    title: "Track Name",
    imgUri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Square_gray.svg/1200px-Square_gray.svg.png",
};

const RATING_VALUES = ["Low", "Low-Mid", "Medium", "Mid-High", "High"];
const RATING_COLORS = [
    colours.voteDown,
    "#FFAA00",
    colours.primary,
    "#66CC00",
    colours.voteUp,
];

let currentTrackId = -1;
let currAudioFile = "";
let nextAudioFile = "";

const PlayerScreen = ({ route, navigation }) => {
    const { patient } = route.params;

    const [audio, setAudio] = useState(null);
    const [preloadedSound, setPreloadedSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [nextDuration, setNextDuration] = useState(0);
    const [position, setPosition] = useState(0);

    const [isPreloading, setIsPreloading] = useState(false);
    const [usePreloadedImmediately, setUsePreloadedImmediately] = useState(false); // if true, use preloaded track immediately

    const { isLoading, setIsLoading } = useContext(LoadingContext);

    const [songInfo, setSongInfo] = useState(DEFAULT_SONG_INFO);
    const [nextSongInfo, setNextSongInfo] = useState(DEFAULT_SONG_INFO);

    const [rating, setRating] = useState(3);
    const [ratingColor, setRatingColor] = useState(RATING_COLORS[rating - 1]);
    const [ratingText, setRatingText] = useState(RATING_VALUES[rating - 1]);

    const [elapsedTime, setElapsedTime] = useState("0:00");
    const [isLooping, setIsLooping] = useState(false);

    const ratingRef = useRef(rating);

    useEffect(() => {
        updateSong(false, true); 
        updateSong(true, true);
    }, []);

    const togglePlayPause = async () => {
        if (isPlaying) {
            await audio.pauseAsync();
        } else {
            const playbackStatus = await audio.playAsync();
            setPosition(playbackStatus.positionMillis);
        }
        setIsPlaying(!isPlaying);
    };

    const handleSliderValueChange = async (value) => {
        if (audio) {
            await audio.setPositionAsync(value);
        }
    };

    const updateTrackRating = async () => {
        const response = await fetch(`${Constants.expoConfig.extra.apiUrl}/track/rating`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                patientId: patient._id,
                trackId: currentTrackId,
                rating: ratingRef.current - 3
            }),
        });

        const data = await response.json();

        if (data.status === "ERROR") {
            console.error("ERROR: " + data.message);
            return;
        }
    };

    const cleanTempFolder = async (fileName, isPreloading) => 
    {    
        nextAudioFile = fileName;

        const payload = {
            patientId: patient._id,
            keepFiles: [currAudioFile, nextAudioFile]
        };

        console.log("payload: " + JSON.stringify(payload));

        const response = await fetch(`${Constants.expoConfig.extra.apiUrl}/track/clean`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) 
        {
            alert('Something went wrong!');
        }
    };

    const updateSong = async (isPreloading=true, isFirstLoad=false) => { // get audio file for a track based on algorithm // isNextTrack true means preloading next track
        console.log("isPreloading: " + isPreloading);

        if (!isPreloading)
            setIsLoading(true);
        else
            setIsPreloading(true);

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: false,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });

        const payload = {
            patientId: patient._id,
			prevTrackId: currentTrackId,
        };

        const response = await fetch(`${Constants.expoConfig.extra.apiUrl}/track/next`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            alert('Something went wrong!');
            setIsLoading(false);
            return; 
        }

        let data = await response.json();
        const { track } = data;
        
        currentTrackId = track._id;

        const newSongInfo = {
			title: `${track.Title} - ${track.Artist ? track.Artist: "Unknown"}`,
            imgUri: track.ImageURL,
        };

        if (!isPreloading)
            setSongInfo(newSongInfo);
        else
            setNextSongInfo(newSongInfo);

        const youtubeUrl = `https://www.youtube.com/watch?v=${track.URI}`;
        data = await fetch(`${Constants.expoConfig.extra.apiUrl}/track/audio-url?videoUrl=${encodeURIComponent(youtubeUrl)}&patientId=${patient._id}`);

        const { audioURL } = await data.json();

        console.log ("audioURL: " + audioURL);

        const fileName = audioURL.split("/").pop();

        if (isFirstLoad)
        {
            if (!isPreloading)
                currAudioFile = fileName;
            else
                nextAudioFile = fileName;
        }
        else
            await cleanTempFolder(fileName, isPreloading); 
        
        const { sound, status } = await Audio.Sound.createAsync({ uri: audioURL });
        
        if (!isPreloading)
        {
            setAudio(sound);
            setDuration(status.durationMillis);
            setElapsedTime("0:00");
        }
        else
        {
            setPreloadedSound(sound);
            setNextDuration(status.durationMillis);
        }

        if (!isPreloading)
            setIsLoading(false);
        else
            setIsPreloading(false);
    };  

    const loadPreloadedTrack = async () => {
        if (preloadedSound) {
            setAudio(preloadedSound);
            setDuration(nextDuration);
            setElapsedTime("0:00");
            setIsPlaying(true);
            await preloadedSound.playAsync(); 
        } else {
            await updateSong(true);
        }
    }    

    useEffect(() => {
        if (usePreloadedImmediately)
        {
            nextTrack();
            setIsLoading(false);
            setUsePreloadedImmediately(false);
        }
    }, [isPreloading]);
 
    const nextTrack = async () => {
        if (isPreloading)
        {
            setUsePreloadedImmediately(true);
            setIsLoading(true);
            return;
        }

        if (audio) {
            await audio.unloadAsync();
        }
    
        await updateTrackRating();

        setSongInfo(nextSongInfo);

        setRating(3);
        ratingRef.current = 3;
        setRatingColor(RATING_COLORS[2]);
        setRatingText(RATING_VALUES[2]);

        currAudioFile = nextAudioFile;
        nextAudioFile = "";
        
        await loadPreloadedTrack();
    
        setIsPlaying(true); 
    
        updateSong(true);
    };
    
    useEffect(() => {
        if (audio) 
        {
            audio.setOnPlaybackStatusUpdate((status) => {
                setPosition(status.positionMillis);
    
                const totalSeconds = Math.floor(status.positionMillis / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                setElapsedTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    
                if (status.didJustFinish) {
                    if (isLooping) {
                        // TODO: increase rating for this track by 1
                        audio.replayAsync(); // Replay track if isLooping is true
                    }
                    else {
                        nextTrack(); 
                    }
                }
            });
        }
    }, [audio, isLooping]);  // add audio and isLooping as dependency

    const handleRatingValueChange = (value) => {
        setRating(value);
        ratingRef.current = value; // Add this line
        setRatingColor(RATING_COLORS[value - 1]);
        setRatingText(RATING_VALUES[value - 1]);
    };    

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} onClick={
                async () => {
                    if (audio) {
                        await audio.unloadAsync();
                    }
                }
            } />
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
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={duration}
                            value={position}
                            onSlidingComplete={handleSliderValueChange}
                            minimumTrackTintColor="#3d5875"
                            maximumTrackTintColor="#d3d3d3"
                            thumbTintColor="#3d5875"
                        />
                        <Text style={styles.elapsedTime}>{elapsedTime}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => console.log("BACK")}
                        >
                            <FontAwesomeIcon icon={faBackward} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                setIsLooping(!isLooping);
                            }}
                        >
                            <FontAwesomeIcon icon={faRepeat} size={20} />
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
                            onPress={() => nextTrack()}
                        >
                            <FontAwesomeIcon icon={faForward} size={20} />
                        </TouchableOpacity>
                    </View>
                    <Text
                        style={[
                            {
                                color: isLooping
                                    ? colours.primary
                                    : colours.secondary,
                            },
                            styles.loopText,
                        ]}
                    >
                        Loop: {isLooping ? "On" : "Off"}
                    </Text>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.sliderContainer}>
                <Slider
                    style={styles.ratingSlider}
                    minimumValue={1}
                    maximumValue={5}
                    step={1}
                    value={rating}
                    minimumTrackTintColor={ratingColor}
                    maximumTrackTintColor="#CCCCCC"
                    onValueChange={handleRatingValueChange}
                />
                    <View style={styles.sliderValues}>
                        {[0, 1, 2, 3, 4, 5].map((value) => (
                            <Text key={value} style={styles.sliderValue}>
                                {value}
                            </Text>
                        ))}
                    </View>
                    <Text style={{ ...styles.ratingText, color: ratingColor }}>
                        {ratingText}
                    </Text>
                </View>
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

export default PlayerScreen;