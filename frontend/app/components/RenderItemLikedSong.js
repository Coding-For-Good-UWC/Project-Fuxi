import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const RenderItemLikedSong = ({ heightItem }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.navigate('LikedSongsScreen')}>
            <View style={{ height: heightItem }}>
                <LinearGradient colors={['#1e957f', '#13747e']} style={[styles.itemLikedSong, { height: heightItem }]}>
                    <Ionicons name="heart" color="#fff" size={70} />
                </LinearGradient>
            </View>
            <Text style={styles.likesSongText}>Liked songs</Text>
        </TouchableOpacity>
    );
};

export default RenderItemLikedSong;

const styles = StyleSheet.create({
    likesSongText: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        color: '#222C2D',
        marginTop: 12,
    },
    itemLikedSong: {
        borderRadius: 6,
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
