import React from 'react';
import { 
    TouchableOpacity, 
    StyleSheet,
    Text,
} from 'react-native';

import colours from '../config/colours.js';

function StyledButton({ text, onPress }) {
    return (
        <TouchableOpacity
            style={styles.buttonContainer}
            onPress={onPress}
            underlayColor={colours.highlight}
        >
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: colours.primary,
        borderRadius: 10,
        width: 120,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        marginTop: 10
    },
    buttonText: {
        color: colours.bg,
        textAlign: "center",
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,
        fontWeight: "450",
    },
});

export default StyledButton;
