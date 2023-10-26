import { TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import SongItem from './SongItem';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { removeReactTrack } from '../api/profileReact';
import { getStoreData } from '../utils/AsyncStorage';

const preference = {
    SDK: {
        status: 'strongly dislike',
        color: '#C31E1E',
    },
    DK: {
        status: 'dislike',
        color: '#222C2D',
    },
    NT: {
        status: 'neutral',
        color: '#fff',
    },
    LK: {
        status: 'like',
        color: '#137882',
    },
    SLK: {
        status: 'strongly like',
        color: '#FFC857',
    },
};

const ReactSongItem = ({ item, reactTrack, setIsDialogVisible, setDialogProps, dataTracksOrigin }) => {
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
        showDialogDislike(item);
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

    const handleStatusLike = async (itemId) => {
        console.log(itemId);
        const profileData = await getStoreData('profile0');
        const { _id } = JSON.parse(profileData);
        const response = await removeReactTrack(_id, itemId);
        if (response) {
            setIsDialogVisible(false);
            setCurrentReactTrack(preference.NT);
        }
    };

    const handleStatusDislike = (itemId) => {
        console.log(itemId);
    };

    return (
        <SongItem
            item={item}
            iconRight={
                <>
                    {Object.keys(currentReactTrack).length !== 0 && currentReactTrack.status !== 'neutral' && (
                        <TouchableOpacity style={{ padding: 2 }} onPress={handleShowDialogLike}>
                            <Ionicons name="heart" color={currentReactTrack.color} size={26} />
                        </TouchableOpacity>
                    )}
                </>
            }
            onPress={handleNavigation}
        />
    );
};

export default ReactSongItem;
