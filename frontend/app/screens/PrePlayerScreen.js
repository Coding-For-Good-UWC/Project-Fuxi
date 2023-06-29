import React from "react";
import BackButton from "../components/BackButton.js";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from "react-native";
import colours from "../config/colours.js";

function PrePlayerScreen({ route, navigation }) {
    const { patient } = route.params;

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation}/>
            <View style={styles.topContainer}>
                <Text style={styles.title}>How would you like to listen?</Text>
            </View>
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ManualPlayer", { patient })}>
                    <Text style={styles.buttonText}>Manual</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Player", { patient })}>
                    <Text style={styles.buttonText}>Automatic</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
    },
    topContainer: {
        // flex: 0.3,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
    },
    bottomContainer: {
        // flex: 0.3,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
    button: {
        backgroundColor: colours.primary,
        borderRadius: 15,
        paddingVertical: 32,
        paddingHorizontal: 32,
        marginBottom: 30,
        width: 250
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 24,
        textAlign: "center",
    },
});

export default PrePlayerScreen;
