import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import CustomGridLayout from './CustomGridLayout';

const RenderPlayListItem = ({ onpress, heightItem, data, namePlaylist }) => {
    return (
        <TouchableOpacity onPress={onpress}>
            <View style={{ height: heightItem, borderRadius: 6, overflow: 'hidden' }}>
                <CustomGridLayout columns={2} data={data} />
            </View>
            <Text style={styles.likesSongText} numberOfLines={2}>
                Ninaazarova's playlist
            </Text>
        </TouchableOpacity>
    );
};

export default RenderPlayListItem;

const styles = StyleSheet.create({
    likesSongText: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        color: '#222C2D',
        marginTop: 12,
    },
});
