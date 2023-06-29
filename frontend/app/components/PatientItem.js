import React from "react";

import { StyleSheet, View, Image, Text } from "react-native";

import GenreTag from "./GenreTag";

import colours from "../config/colours";

function PatientItem(props) {
    const { name, age, language, genres }  = props.patient;
    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.name}>{name}, {age}</Text>
                <View style={styles.genreTags}>
                    {genres.map((genre, index) => {
                        return <GenreTag key={index} genre={genre} />;
                    })}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: colours.secondary,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 30,
        paddingVertical: 10,
        width: "100%",
        minHeight: 100,
        marginBottom: 10,
        borderRadius: 10,
    },
    info: {
        flexDirection: "column",
        justifyContent: "center",
    },
    name: {
        color: colours.primaryText,
        fontSize: 20,
        fontWeight: "500",
        marginBottom: 5,
    },
    genreTags: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
    },
});

export default PatientItem;