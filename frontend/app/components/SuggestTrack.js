import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/core';

const SuggestTrack = ({ heightItem }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.navigate('SuggestTrackScreen')}>
            <View style={{ height: heightItem }}>
                <Image source={require('../assets/default_l8mbsa.png')} style={{ width: '100%', height: '100%', borderRadius: 6 }} />
            </View>
            <Text style={styles.likesSongText}>Suggestion for you</Text>
        </TouchableOpacity>
    );
};

export default SuggestTrack;

const styles = StyleSheet.create({
    likesSongText: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        color: '#222C2D',
        marginTop: 12,
    },
    itemLikedSong: {
        backgroundColor: 'yellow',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
