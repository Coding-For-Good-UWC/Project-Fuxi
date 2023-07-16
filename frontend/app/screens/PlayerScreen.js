import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import {
    View,
    Text,
    StatusBar
} from "react-native";
import Slider from '@react-native-community/slider';
import Constants from 'expo-constants'

import { Audio } from "expo-av";
import LoadingContext from "../store/LoadingContext.js";

import colours from "../config/colours.js";
import { styles } from "../styles/playerStyles.js";
import AudioPlayerComponent from "../components/AudioPlayerComponent.js";

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
let nextTrackId = -1;
let ratingTrackId = -1; 

let currAudioFile = "";
let nextAudioFile = "";

const PlayerScreen = ({ route, navigation }) => {
    const [audio, setAudio] = useState(null);
    const { patient } = route.params;
    const [prevAudioURL, setPrevAudioURL] = useState(null);
    const [currentaudio, setcurrentaudio] = useState(null);
    const [preloadedSound, setPreloadedSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [nextDuration, setNextDuration] = useState(0);
    const [isDone, setIsDone] = useState(false);

    const [isPreloading, setIsPreloading] = useState(false);
    const [usePreloadedImmediately, setUsePreloadedImmediately] = useState(false); // if true, use preloaded track immediately

    const { setIsLoading } = useContext(LoadingContext);

    const [songInfo, setSongInfo] = useState(DEFAULT_SONG_INFO);
    const [nextSongInfo, setNextSongInfo] = useState(DEFAULT_SONG_INFO);

    const [rating, setRating] = useState(3);
    const [ratingColor, setRatingColor] = useState(RATING_COLORS[rating - 1]);
    const [ratingText, setRatingText] = useState(RATING_VALUES[rating - 1]);
    const [elapsedTime, setElapsedTime] = useState("0:00");

    const ratingRef = useRef(rating);

    useEffect(() => 
    {
        const init = async () =>
        {
            await updateSong(false, true); 
            await updateSong(true, true);
        }
        
        init();
    }, []);

    const updateTrackRating = async () => {
        const response = await fetch(`${Constants.expoConfig.extra.apiUrl}/track/rating`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                patientId: patient._id,
                trackId: ratingTrackId,
                rating: ratingRef.current - 3
            }),
        });

        const data = await response.json();

        if (data.status === "ERROR") {
            console.error("ERROR: " + data.message);
            return;
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
        
        if (isPreloading) {
            nextTrackId = track._id;
        } else {
            currentTrackId = track._id;
        }

        if (isFirstLoad)
        {
            ratingTrackId = currentTrackId;
        }

        const newSongInfo = {
			title: `${track.Title} - ${track.Artist ? track.Artist: "Unknown"}`,
            imgUri: track.ImageURL,
        };

        if (!isPreloading)
            setSongInfo(newSongInfo);
        else
            setNextSongInfo(newSongInfo);

        const youtubeUrl = `https://www.youtube.com/watch?v=${track.YtId}`;
        data = await fetch(`${Constants.expoConfig.extra.apiUrl}/track/audio-url?videoUrl=${encodeURIComponent(youtubeUrl)}&patientId=${patient._id}`);

        const { audioURL } = await data.json();

        console.log ("audioURL: " + audioURL);
         setcurrentaudio(audioURL);

        const fileName = audioURL.split("/").pop();

        if (isFirstLoad)
        {
            if (!isPreloading){
            
                currAudioFile = fileName;
            }
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

    const cleanTempFolder = async (fileName, isPreloading) => 
    { 
        console.log("CLEANING TEMP FOLDER")

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

    const loadPreloadedTrack = async () => {
        try {
            if (preloadedSound) {
                setAudio(preloadedSound);

                await preloadedSound.playAsync(); 
                setDuration(nextDuration);
                setElapsedTime("0:00");

                setIsPlaying(true);
            } else {
                throw new Error("Preloaded sound is not ready.");
            }
        } catch (error) {
            console.log("Preloaded sound was not ready. Loading next track.", error); // TODO: BUG WHEN SLIDER REACHES END OF SONG AND GETS STUCK
            await updateSong(true);
        }
    };    

    useEffect(() => { 
        if (usePreloadedImmediately)
        {
            nextTrack();
            setIsLoading(false);
            setUsePreloadedImmediately(false);
        }
    }, [isPreloading]);

    useEffect(() => {
        // This function is triggered every time 'prevAudioURL' changes.
        // Here, you can implement the logic to use the updated 'prevAudioURL' value.
      }, [prevAudioURL]);
      
 
    const nextTrack = async () => {
        setPrevAudioURL(currentaudio)
        console.log("prev"+prevAudioURL)
        if (isPreloading) {
            console.log("WAITING FOR PRELOADING TO FINISH");
            setUsePreloadedImmediately(true);
            setIsLoading(true);
            return
        }
    
        console.log("NEXT TRACK");
    
        if (audio) {
            await audio.unloadAsync();
        }
        
        currentTrackId = nextTrackId; // Update the currentTrackId to nextTrackId before rating
        await updateTrackRating();
    
        setSongInfo(nextSongInfo);
        setRating(3);
        ratingRef.current = 3;
        setRatingColor(RATING_COLORS[2]);
        setRatingText(RATING_VALUES[2]);

        ratingTrackId = nextTrackId;
        
        // Load and play the preloaded track.
        await loadPreloadedTrack();  

        // Now start preloading the next track.
        await updateSong(true);  
    };


    const handleRatingValueChange = (value) => {
        setRating(value);
        ratingRef.current = value; // Add this line
        setRatingColor(RATING_COLORS[value - 1]);
        setRatingText(RATING_VALUES[value - 1]);
    };    

    const handleTrackFinish = () => {
        nextTrack();
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={colours.bg} barStyle="dark-content" />
            <AudioPlayerComponent 
                audio={audio}
                songInfo={songInfo}
                duration={duration}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                elapsedTime={elapsedTime}
                setElapsedTime={setElapsedTime}
                onTrackFinish={handleTrackFinish} // Pass the onTrackFinish callback
                onBack={prevAudioURL}
            />
            <View style={styles.ratingContainer}>
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

export default PlayerScreen;
