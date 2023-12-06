import { Dimensions, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import SongItem from './SongItem';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { removeReactTrack } from '../api/profileReact';
import { getStoreData } from '../utils/AsyncStorage';
import { preference } from '../utils/utils';

const ReactSongItem = ({ item, reactTrack, setIsDialogVisible, setDialogProps, dataTracksOrigin, playlistId, icon, removeTrack, isCircle }) => {
    const navigation = useNavigation();
    const [currentReactTrack, setCurrentReactTrack] = useState({});

    useEffect(() => {
        for (const key in preference) {
            if (preference[key].status === reactTrack) {
                setCurrentReactTrack(preference[key]);
                break;
            }
        }
    }, [reactTrack]);

    const handleShowDialogLike = () => {
        showDialogLike(item._id);
    };

    const handleShowDialogDislike = () => {
        showDialogDislike(item._id);
    };

    const handleNavigation = () => {
        navigation.navigate('PlayMedia', {
            track: item,
            currentReactTrack: currentReactTrack,
            dataTracksOrigin: dataTracksOrigin,
            playlistId: playlistId,
            isCircle: isCircle,
        });
    };

    const showDialogLike = (itemId) => {
        setDialogProps({
            title: 'Unlike this song?',
            desc: 'This song will be played less frequently for you.',
            labelYes: 'Confirm',
            labelNo: 'No, go back',
            onPressYes: () => handleRemoveReact(itemId),
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
            onPressYes: () => handleRemoveReact(itemId),
            onPressNo: () => setIsDialogVisible(false),
        });
        setIsDialogVisible(true);
    };

    const handleRemoveReact = async (itemId) => {
        setIsDialogVisible(false);
        const profile0 = await getStoreData('profile0');
        if (profile0 !== null) {
            const { _id } = JSON.parse(profile0);
            const response = await removeReactTrack(_id, itemId);
            if (response) {
                if (removeTrack && typeof removeTrack === 'function') {
                    removeTrack(itemId);
                }
                setCurrentReactTrack({});
            }
        } else {
            alert('Please create a profile to use this feature');
        }
    };

    return (
        <SongItem
            item={item}
            iconRight={
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {Object.keys(currentReactTrack).length !== 0 &&
                        currentReactTrack.status !== 'dislike' &&
                        currentReactTrack.status !== 'strongly dislike' && (
                            <TouchableOpacity style={{ padding: 2 }} onPress={handleShowDialogLike}>
                                <Ionicons name="heart" color={currentReactTrack.color} size={26} />
                            </TouchableOpacity>
                        )}
                    {Object.keys(currentReactTrack).length !== 0 &&
                        currentReactTrack.status !== 'like' &&
                        currentReactTrack.status !== 'strongly like' && (
                            <TouchableOpacity style={{ padding: 2 }} onPress={handleShowDialogDislike}>
                                <Ionicons name="sad-outline" color={currentReactTrack.color} size={26} />
                            </TouchableOpacity>
                        )}
                    {icon}
                </View>
            }
            onPress={handleNavigation}
        />
    );
};

export default ReactSongItem;
