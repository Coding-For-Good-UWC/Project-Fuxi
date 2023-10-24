import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Toast = ({ message, visible }) => {
    if (!visible) {
        return null;
    }

    return (
        <View style={styles.toastContainer}>
            <Text style={styles.toastText}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: '20%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toastText: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 20,
        color: '#F5EFF7',
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3,
    },
});

export default Toast;
