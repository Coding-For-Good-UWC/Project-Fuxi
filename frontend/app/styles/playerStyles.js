import { StyleSheet } from "react-native";
import colours from "../config/colours";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.bg,
        paddingHorizontal: 20,
    },
    topContainer: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 100,
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
    ratingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // paddingTop: 20,
        // paddingBottom: 120,
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
    controlsContainer: {
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