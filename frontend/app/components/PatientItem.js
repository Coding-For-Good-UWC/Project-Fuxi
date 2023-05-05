import React, { useState } from "react";

import { StyleSheet, View, Image, Text } from "react-native";

import GenreTag from "./GenreTag";

import colours from "../config/colours";

function PatientItem(props) {
    const { name, age, gender, genres }  = props.patient;
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={{ uri: "https://picsum.photos/200" }} />
            <View style={styles.info}>
                <Text style={styles.name}>{name} ({gender}), {age}</Text>
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
        backgroundColor: colours.primary,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 10,
        width: "100%",
        height: 100,
        marginBottom: 10,
        borderRadius: 10,
    },
    image: {
        height: 80,
        width: 80,
        borderRadius: 10,
        marginRight: 10,
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