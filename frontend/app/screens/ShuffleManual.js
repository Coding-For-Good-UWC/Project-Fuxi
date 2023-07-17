import React, { useState, useEffect, useContext, useCallback } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";
import AudioPlayerComponent from "../components/AudioPlayerComponent.js";
import { useIsFocused } from "@react-navigation/native";
import Constants from "expo-constants";
import { Audio } from "expo-av";
import LoadingContext from "../store/LoadingContext.js";
import colours from "../config/colours.js";
let songIndex = 0;
const DEFAULT_SONG_INFO = {
    title: "Track Name",
    imgUri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Square_gray.svg/1200px-Square_gray.svg.png",
};

const ShuffleManual = ({ route, navigation }) => {
    const { patient } = route.params;

    const [audio, setAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const { setIsLoading } = useContext(LoadingContext);
    const [songInfo, setSongInfo] = useState(DEFAULT_SONG_INFO);
    const [playset, setPlayset] = useState(null);
    const [elapsedTime, setElapsedTime] = useState("0:00");
    const isFocused = useIsFocused();

    useEffect(() => {
        getManualPlayset();
        if (!isFocused && audio) {
            audio.unloadAsync();
        }
    }, [isFocused]);

    const playSong = async (playset) => {
        if (audio) {
            await audio.unloadAsync();
        }
        setIsLoading(true);

        const track = await getNextTrack(playset);
        console.log(songIndex);

        const newSongInfo = {
            title: track.Title,
            imgUri: track.ImageURL,
            artist: track.Artist,
        };

        setSongInfo(newSongInfo);
        
        // Make a post request to audio-url and pass the track objet and patient id
        const response2 = await fetch(`${Constants.expoConfig.extra.apiUrl}/track/audio-url`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                track: track,
                patientId: patient._id
            })
        });

        if (response2.status === "ERROR") {
            alert('Something went wrong!');
            setIsLoading(false);
            return;
        }

        const data2 = await response2.json();

        const { audioURL } = data2;

        const { sound, status } = await Audio.Sound.createAsync({ uri: audioURL });

        setAudio(sound);
        setDuration(status.durationMillis);
        setElapsedTime("0:00");
        setIsLoading(false);
        setIsPlaying(true);
        await sound.playAsync(); // Start playing the song
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
            console.error("Error fetching manual playset:", error);
        }
    };

    const handleView = async () => {
        // Create a string of song names
        const songNames = playset
            .map((item, index) => `${index + 1}. ${item.Title}`)
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
            console.log("in track" + songIndex);
            const nextTrack = playset[songIndex];
            return nextTrack;
        } else {
            return null;
        }
    };

    const prevSong = () => {
        isBack = true; // set isBack flag
        setIsPlaying(false);
        if (audio) {
            audio.stopAsync().then(() => playSong(playset));
        }
    };

    return (
        <View style={styles.container}>
            <AudioPlayerComponent
                audio={audio}
                songInfo={songInfo}
                duration={duration}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                elapsedTime={elapsedTime}
                setElapsedTime={setElapsedTime}
                onTrackFinish={() => playSong(playset)}
                onTrackPrev={prevSong}
            />
            <Text></Text>

            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={{
                        backgroundColor: colours.primary,
                        height: 50,
                        width: 120,
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 10,
                        borderRadius: 5,
                    }}
                    onPress={() => {
                        handleView();
                    }}
                >
                    <Text style={{ color: "white", fontSize: 10, padding: 10 }}>
                        View Current Playset
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.bg,
        paddingHorizontal: 20,
        paddingTop: 100,
    },
    topContainer: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
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
        paddingBottom: 80,
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
        marginLeft: 22,
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
