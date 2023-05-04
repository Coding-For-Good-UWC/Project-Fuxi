import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colours from '../config/colours.js';

function BackButton({ navigation }) {
    return (
        <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigation.goBack()}
        >
            <Ionicons name="arrow-back" size={24} color={colours.primaryText} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: colours.secondary,
        borderRadius: 25, //
        width: 50, 
        height: 50, 
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 60, 
        left: 30, 
        zIndex: 1, 
    },
});

export default BackButton;
