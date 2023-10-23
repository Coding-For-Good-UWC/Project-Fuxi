import { TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import SongItem from './SongItem';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

const ReactSongItem = ({ item, setIsDialogVisible, setDialogProps, dataTracksOrigin }) => {
    const navigation = useNavigation();
    const statusLikeEnum = { Normal: '#137882', High: '#FFC857' };
    const statusDislikeEnum = { Normal: '#222C2D', High: '#C31E1E' };
    const [statusLike, setStatusLike] = useState(statusLikeEnum.Normal);
    const [statusDislike, setStatusDislike] = useState(statusDislikeEnum.Normal);

    const handleShowDialogLike = () => {
        showDialogLike(item.id);
    };

    const handleShowDialogDislike = () => {
        showDialogDislike(item.id);
    };

    const handleNavigation = () => {
        navigation.navigate('PlayMedia', { track: item, dataTracksOrigin: dataTracksOrigin });
    };

    const showDialogLike = (itemId) => {
        setDialogProps({
            title: 'Unlike this song?',
            desc: 'This song will be played less frequently for you.',
            labelYes: 'Confirm',
            labelNo: 'No, go back',
            onPressYes: () => handleStatusLike(itemId),
            onPressNo: () => setIsDialogVisible(false),
        });
        setIsDialogVisible(true);
    };

    const showDialogDislike = (itemId) => {
        setDialogProps({
            title: 'Un-Dislike this song?',
            desc: 'This song will be played more frequently for you.',
            labelYes: 'Confirm',
            labelNo: 'No, go back',
            onPressYes: () => handleStatusDislike(itemId),
            onPressNo: () => setIsDialogVisible(false),
        });
        setIsDialogVisible(true);
    };

    const handleStatusLike = (itemId) => {
        console.log(itemId);
        setStatusLike(null);
        setIsDialogVisible(false);
    };

    const handleStatusDislike = (itemId) => {
        console.log(itemId);
        setStatusDislike(null);
        setIsDialogVisible(false);
    };

    return (
        <SongItem
            item={item}
            iconRight={
                <>
                    {statusLike !== null && (
                        <TouchableOpacity onPress={handleShowDialogLike}>
                            <Ionicons name="heart" color={statusLike} size={26} />
                        </TouchableOpacity>
                    )}
                    {statusDislike !== null && (
                        <TouchableOpacity onPress={handleShowDialogDislike}>
                            <Ionicons name="sad-outline" color={statusDislike} size={26} />
                        </TouchableOpacity>
                    )}
                </>
            }
            onPress={handleNavigation}
        />
    );
};

export default ReactSongItem;
