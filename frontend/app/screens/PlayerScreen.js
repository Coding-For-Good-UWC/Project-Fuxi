import React, { useState, useEffect, useContext, useRef } from "react";
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

const PlayerScreen = ({ route, navigation }) => {
    const [audio, setAudio] = useState(null);
    const { patient } = route.params;
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const { setIsLoading } = useContext(LoadingContext);
    const [songInfo, setSongInfo] = useState(DEFAULT_SONG_INFO);
    const [rating, setRating] = useState(3);
    const [ratingColor, setRatingColor] = useState(RATING_COLORS[rating - 1]);
    const [ratingText, setRatingText] = useState(RATING_VALUES[rating - 1]);
    const [elapsedTime, setElapsedTime] = useState("0:00");
    const [prevTracks, setPrevTracks] = useState([]);
    const isSkipping = useRef(false);

    const ratingRef = useRef(rating);

    useEffect(() => 
    {
        const init = async () =>
        {
            setIsLoading(true);
            await updateSong();
            setIsLoading(false);
        }

        init();
    }, []);

    useEffect(() => 
    {
        const prevTrackNames = prevTracks.map((track) => track.Title);
        console.log(prevTrackNames);
    }, [prevTracks]);

    const updateTrackRating = async () => {
        const response = await fetch(`https://project-fuxi-fsugt.ondigitalocean.app/track/rating`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                patientId: patient._id,
                trackId: currentTrackId, // TODO: MAKE SURE UPDATING RATING OF RIGHT TRACK
                rating: ratingRef.current - 3
            }),
        });

        const data = await response.json();

        if (data.status === "ERROR") {
            console.error("ERROR: " + data.message);
            return;
        }
    };

    const updateSong = async () => { // get audio file for a track based on algorithm 
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

        const response = await fetch(`https://project-fuxi-fsugt.ondigitalocean.app/track/next`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            alert('Something went wrong!');
            return; 
        }

        let data = await response.json();
        const { track } = data;
        
        currentTrackId = track._id;

        const newSongInfo = {
			title: `${track.Title} - ${track.Artist ? track.Artist: "Unknown"}`,
            imgUri: track.ImageURL,
        };

        setSongInfo(newSongInfo);

        // Make a post request to audio-url and pass the track objet and patient id
        const response2 = await fetch(`https://project-fuxi-fsugt.ondigitalocean.app/track/audio-url`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                track: track,
                patientId: patient._id
            })
        });

        if (response2.status === "ERROR") {
            alert('Something went wrong!');
            return;
        }

        const data2 = await response2.json();

        const { audioURL } = data2;

        console.log ("audioURL: " + audioURL);

        const { sound, status } = await Audio.Sound.createAsync({ uri: audioURL });

        setAudio(sound);
        setDuration(status?.durationMillis);
        setElapsedTime("0:00");
        
        await sound.playAsync();
        setIsPlaying(true);

        // push new song to prevTracks
        const newPrevTracks = [...prevTracks];
        newPrevTracks.push(track);
        setPrevTracks(newPrevTracks);
    };  

    const nextTrack = async () => 
    {
        if (isSkipping.current) {
            return;
        }
        
        isSkipping.current = true;

        console.log("NEXT TRACK");
    
        if (audio) {
            await audio.unloadAsync();
        }
        
        await updateTrackRating();
    
        setRating(3);
        ratingRef.current = 3;
        setRatingColor(RATING_COLORS[2]);
        setRatingText(RATING_VALUES[2]);

        await updateSong();  

        isSkipping.current = false;
    };

    const handleRatingValueChange = (value) => {
        if (isSkipping.current) 
            return;

        setRating(value);
        ratingRef.current = value; // Add this line
        setRatingColor(RATING_COLORS[value - 1]);
        setRatingText(RATING_VALUES[value - 1]);
    };    

    const onTrackPrev = async () => 
    {
        if (audio) {
            await audio.unloadAsync();
        }
        
        await updateTrackRating();
    
        setRating(3);
        ratingRef.current = 3;
        setRatingColor(RATING_COLORS[2]);
        setRatingText(RATING_VALUES[2]);
        
        await Audio.setAudioModeAsync({ // TODO: separate function with all common code with updateSong
            allowsRecordingIOS: false,
            staysActiveInBackground: false,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });
        
        const track = prevTracks[prevTracks.length - 1];
        
        if (!track) {
            nextTrack(); 
        }
        
        // remove last track from prevTracks
        const newPrevTracks = [...prevTracks];
        newPrevTracks.pop();
        setPrevTracks(newPrevTracks);
    
        currentTrackId = track._id;

        const newSongInfo = {
			title: `${track.Title} - ${track.Artist ? track.Artist: "Unknown"}`,
            imgUri: track.ImageURL,
        };

        setSongInfo(newSongInfo);

        // Make a post request to audio-url and pass the track objet and patient id
        const response2 = await fetch(`https://project-fuxi-fsugt.ondigitalocean.app/track/audio-url`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify
            ({
                track: track,
                patientId: patient._id
            })
        });

        if (response2.status === "ERROR") {
            alert('Something went wrong!');
            return;
        }

        const data2 = await response2.json();

        const { audioURL } = data2;

        console.log ("audioURL: " + audioURL);
        const { sound, status } = await Audio.Sound.createAsync({ uri: audioURL });
        
        setAudio(sound);

        await sound.playAsync();
        setDuration(status.durationMillis);
        setElapsedTime("0:00");

        setIsPlaying(true);
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
                onTrackFinish={nextTrack}
                onTrackPrev={onTrackPrev}
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
