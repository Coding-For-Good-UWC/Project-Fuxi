import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Empty = ({ label, style, styleText }) => {
    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.text, styleText]}>{label}</Text>
        </View>
    );
};

export default Empty;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        color: '#757575',
    },
});
