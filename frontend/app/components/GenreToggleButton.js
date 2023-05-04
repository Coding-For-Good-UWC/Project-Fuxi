import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import colours from "../config/colours.js";

function MusicToggleButton(props) {
    const [borderColor, setBorderColor] = useState(colours.primary);

    const toggleSelected = () => {
        const newColor =
            borderColor === colours.tertiary
                ? colours.bg
                : colours.tertiary;
        setBorderColor(newColor);
    };

    return (
        <TouchableOpacity onPress={toggleSelected}>
            <View style={[styles.container, { borderColor: borderColor }]}>
                <Text style={styles.genreText}>{props.genre}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 140,
        height: 40,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 2,
    },
    genreText: {
        color: colours.primaryText,
        fontSize: 18,
    },
});

export default MusicToggleButton;
