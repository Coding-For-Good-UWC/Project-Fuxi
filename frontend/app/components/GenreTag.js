import React, { useState } from "react";

import { StyleSheet, View, Text } from "react-native";

import colours from "../config/colours";

function GenreTag(props) {
    const { genre } = props;
    return (
        <View style={styles.container}>
            <Text style={styles.genre}>{genre}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colours.voteDown,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 5,
        paddingVertical: 2,
        marginRight: 5,
        marginBottom: 5,
    },
    genre: {
        color: colours.primaryText,
        fontSize: 14,
        fontWeight: "500",
    },
});

export default GenreTag;