import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import ToggleDialog from './ToggleDialog';
import { preference } from '../utils/utils';
import { addReactTrack, updateReactTrack } from '../api/profileReact';
import { getStoreData } from '../utils/AsyncStorage';
import { getReactTrackByTrackId } from '../api/profileReact';

const getReact = async (trackId) => {
    const profile0 = await getStoreData('profile0');
    if (profile0 !== null) {
        const { _id } = JSON.parse(profile0);
        const response = await getReactTrackByTrackId(_id, trackId);
        const { data } = response;
        if (data?.preference !== undefined) {
            for (const key in preference) {
                if (preference[key].status === data.preference) {
                    return preference[key];
                }
            }
        }
    }
};

const FollowPlayMedia = ({ playlistId, selectSound, reactTrack, setDataTracks, setReactTrack, removeTrack }) => {
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const showDialogLike = () => {
        if (reactTrack.status == 'strongly like') {
            alert('Maximum liking achieved');
        } else if (reactTrack.status == 'like') {
            setDialogProps({
                title: 'Like this song?',
                desc: 'We’ll play this song more frequently for you.',
                labelYes: 'Yes, I like it',
                labelNo: 'No, go back',
                onPressYes: async () => {
                    await handleStatusLike();
                },
                onPressNo: () => setIsDialogVisible(false),
            });
            setIsDialogVisible(true);
        } else if (reactTrack.status == undefined) {
            setDialogProps({
                title: 'Like this song?',
                desc: 'This song will be played more frequently for you.',
                labelYes: 'Yes, I like it',
                labelNo: 'No, go back',
                onPressYes: async () => {
                    await handleStatusLike();
                },
                onPressNo: () => setIsDialogVisible(false),
            });
            setIsDialogVisible(true);
        } else if (reactTrack.status == 'strongly dislike') {
            setDialogProps({
                title: 'Like this song?',
                desc: 'This song will be played more frequently for you.',
                labelYes: 'Yes, I like it',
                labelNo: 'No, go back',
                onPressYes: async () => {
                    await handleStatusLike();
                },
                onPressNo: () => setIsDialogVisible(false),
            });
            setIsDialogVisible(true);
        } else if (reactTrack.status == 'dislike') {
            setDialogProps({
                title: 'Like this song?',
                desc: 'This song will be played more frequently for you.',
                labelYes: 'Yes, I like it',
                labelNo: 'No, go back',
                onPressYes: async () => {
                    await handleStatusLike();
                },
                onPressNo: () => setIsDialogVisible(false),
            });
            setIsDialogVisible(true);
        }
    };

    const showDialogDislike = async () => {
        if (reactTrack.status == 'strongly dislike') {
            alert('Maximum disliking achieved');
        } else if (reactTrack.status == 'dislike') {
            setDialogProps({
                title: 'Dislike this song?',
                desc: 'This song will be played less frequently for you.',
                labelYes: 'I don’t like it',
                labelNo: 'No, go back',
                onPressYes: async () => {
                    await handleStatusDislike();
                },
                onPressNo: () => setIsDialogVisible(false),
                styleBtnYes: { backgroundColor: '#E84C4C' },
            });
            setIsDialogVisible(true);
        } else if (reactTrack.status == undefined) {
            setDialogProps({
                title: 'Dislike this song?',
                desc: 'This song will be played less frequently for you.',
                labelYes: 'I don’t like it',
                labelNo: 'No, go back',
                onPressYes: async () => {
                    await handleStatusDislike();
                },
                onPressNo: () => setIsDialogVisible(false),
                styleBtnYes: { backgroundColor: '#E84C4C' },
            });
            setIsDialogVisible(true);
        } else if (reactTrack.status == 'strongly like') {
            setDialogProps({
                title: 'Dislike this song?',
                desc: 'This song will be played less frequently for you.',
                labelYes: 'I don’t like it',
                labelNo: 'No, go back',
                onPressYes: async () => {
                    await handleStatusDislike();
                },
                onPressNo: () => setIsDialogVisible(false),
                styleBtnYes: { backgroundColor: '#E84C4C' },
            });
            setIsDialogVisible(true);
        } else if (reactTrack.status == 'like') {
            setDialogProps({
                title: 'Dislike this song?',
                desc: 'This song will be played less frequently for you.',
                labelYes: 'I don’t like it',
                labelNo: 'No, go back',
                onPressYes: async () => {
                    await handleStatusDislike();
                },
                onPressNo: () => setIsDialogVisible(false),
                styleBtnYes: { backgroundColor: '#E84C4C' },
            });
            setIsDialogVisible(true);
        }
    };

    const handleStatusLike = async () => {
        const profile0 = await getStoreData('profile0');
        if (profile0 !== null) {
            const { _id } = JSON.parse(profile0);
            if (reactTrack.status == 'like') {
                setReactTrack(preference.SLK);
                setIsDialogVisible(false);
                await updateReactTrack(_id, selectSound._id, preference.SLK.status);
            } else if (reactTrack.status == undefined) {
                setReactTrack(preference.LK);
                setIsDialogVisible(false);
                const response = await addReactTrack(_id, playlistId, selectSound._id, preference.LK.status);
                setDataTracks(response.data);
            } else if (reactTrack.status == 'strongly dislike') {
                setReactTrack(preference.LK);
                setIsDialogVisible(false);
                await updateReactTrack(_id, selectSound._id, preference.LK.status);
            } else if (reactTrack.status == 'dislike') {
                setReactTrack(preference.LK);
                setIsDialogVisible(false);
                await updateReactTrack(_id, selectSound._id, preference.LK.status);
            }
        } else {
            setIsDialogVisible(false);
            alert('Please create a profile to use this feature');
        }
    };

    const handleStatusDislike = async () => {
        const profile0 = await getStoreData('profile0');
        if (profile0 !== null) {
            const { _id } = JSON.parse(profile0);
            if (reactTrack.status == 'dislike') {
                setReactTrack(preference.SDK);
                setIsDialogVisible(false);
                await updateReactTrack(_id, selectSound._id, preference.SDK.status);
            } else if (reactTrack.status == undefined) {
                setReactTrack(preference.DK);
                setIsDialogVisible(false);
                await addReactTrack(_id, playlistId, selectSound._id, preference.DK.status);
            } else if (reactTrack.status == 'strongly like') {
                setReactTrack(preference.DK);
                setIsDialogVisible(false);
                await updateReactTrack(_id, selectSound._id, preference.DK.status);
            } else if (reactTrack.status == 'like') {
                setReactTrack(preference.DK);
                setIsDialogVisible(false);
                await updateReactTrack(_id, selectSound._id, preference.DK.status);
            }
            removeTrack();
            alert('The song is removed from the playlist');
        } else {
            setIsDialogVisible(false);
            alert('Please create a profile to use this feature');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const reactTrack = (await getReact(selectSound._id)) || [];
            setReactTrack(reactTrack);
        };
        fetchData();
    }, [selectSound]);

    return (
        <>
            <View style={styles.following}>
                <View style={styles.followingWrapper}>
                    <TouchableOpacity style={styles.center} onPress={() => showDialogLike()}>
                        <Ionicons
                            name={
                                Object.keys(reactTrack).length !== 0 && (reactTrack.status === 'strongly like' || reactTrack.status === 'like')
                                    ? 'heart'
                                    : 'heart-outline'
                            }
                            size={50}
                            color={
                                Object.keys(reactTrack).length !== 0 && (reactTrack.status === 'strongly like' || reactTrack.status === 'like')
                                    ? reactTrack.color
                                    : '#222C2D'
                            }
                        />
                        <Text>{reactTrack.status === 'strongly like' ? 'Super Like' : 'Like'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.center} onPress={() => showDialogDislike()}>
                        <Ionicons
                            name="sad-outline"
                            size={50}
                            color={
                                Object.keys(reactTrack).length !== 0 && (reactTrack.status === 'strongly dislike' || reactTrack.status === 'dislike')
                                    ? reactTrack.color
                                    : '#222C2D'
                            }
                        />
                        <Text>Dislike</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ToggleDialog
                visible={isDialogVisible}
                title={dialogProps.title}
                desc={dialogProps.desc}
                labelYes={dialogProps.labelYes}
                labelNo={dialogProps.labelNo}
                onPressYes={dialogProps.onPressYes}
                onPressNo={dialogProps.onPressNo}
                styleBtnYes={dialogProps.styleBtnYes}
            />
        </>
    );
};

export default FollowPlayMedia;

const styles = StyleSheet.create({
    following: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    followingWrapper: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
        paddingHorizontal: 60,
        gap: 60,
        minHeight: 130,
    },
    center: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        width: 100,
    },
    viewMessageDislike: {
        position: 'absolute',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        top: -30,
        zIndex: 10,
    },
    messageText: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 20,
        color: '#F5EFF7',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 4,
        backgroundColor: '#000000',
        shadowColor: '#000000',
        elevation: 1,
        shadowOffset: { width: 60, height: 40 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
    },
});
