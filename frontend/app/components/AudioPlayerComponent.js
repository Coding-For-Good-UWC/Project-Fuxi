import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';

import {
    View,
    Text,
    TouchableOpacity,
    Image,

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

import colours from "../config/colours.js";
import { styles } from "../styles/playerStyles.js";

function AudioPlayerComponent(props) 
{
    const { 
        audio, 
        songInfo,
        duration,
        isPlaying,
        setIsPlaying,
        elapsedTime,
        setElapsedTime,
        onTrackFinish
    } = props;

    const [position, setPosition] = useState(0);
    const [isLooping, setIsLooping] = useState(false);
    const [trackFinished, setTrackFinished] = useState(false); // New state to track if the track has finished

    useFocusEffect(
        useCallback(() => {
            return () => {
                audio?.stopAsync();
                setIsPlaying(false); 
            };
        }, [])
    );    

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
                        setTrackFinished(true); // Set trackFinished to true if the track has finished
                    }
                }
            });
        }
    }, [audio, isLooping]);  // add audio and isLooping as dependency

    useEffect(() => {
        if (trackFinished) {
            onTrackFinish(); // Call onTrackFinish when trackFinished is true
            setTrackFinished(false); // Reset trackFinished to false
        }
    }, [trackFinished, onTrackFinish]);

    const togglePlayPause = async () => {
        if (!audio) return;
    
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

    return (
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
                <View style={styles.controlsContainer}>
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
                        onPress={() => onTrackFinish()} // Call onTrackFinish directly instead of using a flag
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
    );
}

export default AudioPlayerComponent;
