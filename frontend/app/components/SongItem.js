import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';

const SongItem = ({ item, iconRight, onPress }) => {
    return (
        <TouchableOpacity style={styles.rowItem} onPress={onPress}>
            <Image source={{ uri: item.ImageURL }} style={styles.songImage} />
            <View style={styles.rowItemText}>
                <Text style={styles.titleText} numberOfLines={1}>
                    {item.Title}
                </Text>
                <Text style={styles.artistText} numberOfLines={1}>
                    {item.Artist}
                </Text>
            </View>
            {iconRight}
        </TouchableOpacity>
    );
};

export default SongItem;

const styles = StyleSheet.create({
    rowItem: {
        flex: 1,
        paddingVertical: 6,
        marginVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    songImage: {
        height: 50,
        width: 50,
        borderRadius: 4,
    },
    rowItemText: {
        flex: 1,
        flexDirection: 'column',
    },
    titleText: {
        fontWeight: '500',
        fontSize: 15,
        lineHeight: 24,
        color: '#222C2D',
    },
    artistText: {
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 16,
        color: '#757575',
    },
});
