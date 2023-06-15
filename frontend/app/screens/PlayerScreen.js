import React, { useState, useEffect, useContext } from "react";
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

import { Audio } from "expo-av";
import LoadingContext from "../store/LoadingContext.js";
import BackButton from "../components/BackButton.js";

import colours from "../config/colours.js";
let currentlyPlaying = -1;

function getRatingColor(value) {
    const colors = [
        colours.voteDown,
        "#FFAA00",
        colours.primary,
        "#66CC00",
        colours.voteUp,
    ];
    return colors[value - 1];
}

function getRatingText(value) {
    const texts = ["Low", "Low-Mid", "Medium", "Mid-High", "High"];
    return texts[value - 1];
}

function PlayerScreen({ route, navigation }) {
    const { patient } = route.params;

    const [audio, setAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [isFirstPlay, setIsFirstPlay] = useState(true);

    const { isLoading, setIsLoading } = useContext(LoadingContext);

    const [songInfo, setSongInfo] = useState({
        title: "Track Name",
        imgUri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Square_gray.svg/1200px-Square_gray.svg.png",
    });

    const [rating, setRating] = useState(3);
    const [ratingColor, setRatingColor] = useState(getRatingColor(rating));
    const [ratingText, setRatingText] = useState(getRatingText(rating));

    const [elapsedTime, setElapsedTime] = useState("0:00");
    const [isLooping, setIsLooping] = useState(false);

    useEffect(() => {
        voteHandler(3);
    }, []);

    const pauseHandler = async () => {
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

    const voteHandler = (finalRating) => {
        const getSong = async () => {
            setIsLoading(true);

            const payload = {
                patientId: patient._id,
                trackId: currentlyPlaying,
                rating: finalRating,
            };

            console.log ("Payload:")
            console.log (payload)

            const response = await fetch ("http://localhost:8080/track/next", {
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

            console.log ("RESPONSE")
            console.log (data)

            const { track } = data;

            currentlyPlaying = data.trackId;

            const youtubeUrl = "https://www.youtube.com/watch?v=" + track.URI;
            data = await fetch("http://localhost:8080/track/audio-url?videoUrl=" + encodeURIComponent(youtubeUrl))
            const { audioURL } = await data.json();
            console.log("audioURL: ", audioURL);

            const { sound } = await Audio.Sound.createAsync({ uri: audioURL });

            console.log ("Loaded sound:")
            console.log (sound)

            setAudio(sound);
            setDuration(sound._durationMillis);

            // Set the listener here, right after creating the audio object
            sound.setOnPlaybackStatusUpdate((status) => {
                console.log(
                    "Updating position to " +
                        status.positionMillis +
                        "/" +
                        duration
                );
                setPosition(status.positionMillis);
                if (status.didJustFinish) {
                    console.log("COMPLETE");
                    setIsPlaying(false);
                }
            });

            setIsLoading(false);
        };

        if (!isLoading) {
            getSong(isFirstPlay ? 0 : rating);
            if (isFirstPlay) setIsFirstPlay(false);
        } else {
            console.log("Already loading a song");
        }
    };

    const onRatingValueChange = (value) => {
        setRating(value);
        setRatingColor(getRatingColor(value));
        setRatingText(getRatingText(value));
    };

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} />
            <StatusBar backgroundColor={colours.bg} barStyle="dark-content" />
            <View style={styles.topContainer}>
                <Text style={styles.title}>Project FUXI</Text>
                <View style={styles.musicInfoContainer}>
                    <Image
                        style={styles.coverImage}
                        source={require("../assets/tempMusicCover.png")}
                    />
                    <Text style={styles.songName} numberOfLines={1}>
                        {songInfo.title}
                    </Text>
                    <View style={styles.progressBarContainer}>
                        {/* <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={100}
                            value={songPercentage}
                            minimumTrackTintColor={colours.primary}
                            maximumTrackTintColor={colours.secondary}
                            thumbTintColor={colours.primary}
                            onValueChange={(value) => {
                                if (sliderTouching) {
                                    setSongPercentage(value);
                                }
                            }}
                            onTouchStart={() => setSliderTouching(true)}
                            onTouchEnd={() => {
                                setSliderTouching(false);
                                onSliderValueChange(songPercentage);
                            }}
                        /> */}
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={duration}
                            value={position}
                            onValueChange={handleSliderValueChange}
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
                            onPress={pauseHandler}
                        >
                            <FontAwesomeIcon
                                icon={isPlaying ? faPause : faPlay}
                                size={20}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => voteHandler(rating)}
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
                        onSlidingComplete={onRatingValueChange}
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
        width: "100%",
        paddingHorizontal: 10,
        marginBottom: 10,
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
