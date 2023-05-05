import React, { useState, useEffect, useContext } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    StatusBar,
} from "react-native";
import Slider from "@react-native-community/slider";
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

function secondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
}

function PlayerScreen({ route, navigation }) {
    const { patient } = route.params;

    const [sound, setSound] = useState(null);
    const [songPercentage, setSongPercentage] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFirstPlay, setIsFirstPlay] = useState(true);
    // const [isLoading, setIsLoading] = useState(false);
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [songInfo, setSongInfo] = useState({
        title: "Track Name",
        imgUri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Square_gray.svg/1200px-Square_gray.svg.png",
    });
    const [sliderTouching, setSliderTouching] = useState(false);

    const [rating, setRating] = useState(3);
    const [ratingColor, setRatingColor] = useState(getRatingColor(rating));
    const [ratingText, setRatingText] = useState(getRatingText(rating));

    const [elapsedTime, setElapsedTime] = useState("0:00");

    const [isLooping, setIsLooping] = useState(false);

    useEffect(() => {
        if (sound) {
            sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        }
    }, [sound]);

    const pauseHandler = async () => {
        if (isFirstPlay) {
            await voteHandler(3);
        }

        if (!sound) {
            console.log("Sound not initialized yet");
            return;
        }

        if (isPlaying) await sound.pauseAsync();
        else await sound.playAsync();

        console.log(isPlaying ? "PAUSED" : "UNPAUSED");

        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        voteHandler(3);
    }, []);

    useEffect(() => {
        return sound
            ? () => {
                  console.log("Unloading Sound");
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

    const onPlaybackStatusUpdate = async (playbackStatus) => {
        if (!playbackStatus.isLoaded) return;

        if (!sliderTouching) {
            setSongPercentage(
                (playbackStatus.positionMillis /
                    playbackStatus.durationMillis) *
                    100
            );
        }

        setElapsedTime(
            secondsToMinutes(Math.floor(playbackStatus.positionMillis / 1000))
        );

        // Check if the track has ended
        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
            console.log("TRACK ENDED");
            if (isLooping) {
                console.log("LOOPING");
                await sound.setPositionAsync(0);
                await sound.playAsync();
            } else {
                console.log("NEXT TRACK");
                voteHandler(rating);
            }
        }
    };

    const onSliderValueChange = async (value) => {
        if (!sliderTouching) {
            if (sound) {
                const newPosition = (value / 100) * sound._durationMillis;
                await sound.setPositionAsync(newPosition);
            }
            setSongPercentage(value);
        }
    };

    const fetchApi = async (url, body) => {
        return await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }).then((res) => res.json());
    };

    const playAudio = async (track) => {
        const id = track.URI.substring(track.URI.indexOf("/d/")).split("/")[2];
        const audio = "https://drive.google.com/uc?export=download&id=" + id;

        try {
            const { sound } = await Audio.Sound.createAsync({ uri: audio });

            setSongInfo({ title: track.Title });
            setSound(sound);
            sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

            if (!isFirstPlay) {
                setIsPlaying(true);
                await sound.playAsync();
            }
        } catch (error) {
            console.log("Error loading audio:", error);
        }
    };

    const voteHandler = (finalRating) => {
        const getSong = async () => {
            setIsLoading(true);

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });

            const response = await fetchApi(
                "http://localhost:8080/track/next",
                {
                    patientId: patient._id,
                    trackId: currentlyPlaying,
                    rating: finalRating,
                }
            );

            if (response.status !== "OK") alert(response.error_message);
            else {
                currentlyPlaying = response.trackId;
                const data = await fetchApi("http://localhost:8080/track/get", {
                    id: currentlyPlaying,
                });

                console.log("Received data " + data);

                if (data.status === "ERROR") console.log(data.message);
                else await playAudio(data.track);
            }

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
                        <Slider
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
                        />
                        <Text style={styles.elapsedTime}>{elapsedTime}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => console.log ("BACK")}
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
