import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import CustomGridLayout from './CustomGridLayout';

const RenderPlayListItem = ({ onpress, heightItem, data }) => {
    const listImages = data.tracks.map((item, index) => (
        <Image key={index} source={{ uri: item.ImageURL }} style={{ width: heightItem / 2, height: heightItem / 2 }} />
    ));
    return (
        <TouchableOpacity onPress={onpress}>
            <View style={{ height: heightItem, borderRadius: 6, overflow: 'hidden' }}>
                <CustomGridLayout columns={2} data={listImages} />
            </View>
            <Text style={styles.likesSongText} numberOfLines={2}>
                {data.namePlaylist}
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
