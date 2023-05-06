import React, { useState } from "react";

import { StyleSheet, View, Text } from "react-native";

import colours from "../config/colours";

function GenreTag(props) {
    const { genre } = props;

    const getColour = (genre) => {
        if (genre == "Cantonese")
            return colours.genreCantonese;
        else if (genre == "Chinese")
            return colours.genreChinese;
        else if (genre == "Christian")
            return colours.genreChristian;
        else if (genre == "English")
            return colours.genreEnglish;
        else if (genre == "Hainanese")
            return colours.genreHainanese;
        else if (genre == "Hindi")
            return colours.genreHindi;
        else if (genre == "Hokkien")
            return colours.genreHokkien;
        else if (genre == "Malay")
            return colours.genreMalay;
        else if (genre == "Mandarin")
            return colours.genreMandarin;
        else if (genre == "TV")
            return colours.genreTV;
        else if (genre == "Tamil")
            return colours.genreTamil;
        else
            return "undefined";
    };

    return (
        <View style={[styles.container, { backgroundColor: getColour(genre) }]}>
            <Text style={styles.genre}>{genre}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 12,
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