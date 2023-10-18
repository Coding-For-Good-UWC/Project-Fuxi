import { StyleSheet, Text, View, Animated, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import ToggleDialog from './ToggleDialog';

const FollowPlayMedia = () => {
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [dialogProps, setDialogProps] = useState({});
    const statusLikeEnum = { Normal: '#222C2D', Medium: '#137882', High: '#FFC857' };
    const [statusLike, setStatusLike] = useState(null);
    const [statusDislike, setStatusDislike] = useState(null);

    const [isVisible, setIsVisible] = useState(false);

    const handleViewClick = () => {
        setIsVisible(true);
        setTimeout(() => {
            setIsVisible(false);
        }, 3000);
    };

    const showDialogLike = () => {
        if (statusLike == null) {
            setDialogProps({
                title: 'Like this song?',
                desc: 'This song will be played more frequently for you.',
                labelYes: 'Yes, I like it',
                labelNo: 'No, go back',
                onPressYes: () => handleStatusLike(),
                onPressNo: () => setIsDialogVisible(false),
            });
        } else if (statusLike == statusLikeEnum.Medium) {
            setDialogProps({
                title: 'Like this song?',
                desc: 'We’ll play this song more frequently for you.',
                labelYes: 'Yes, I like it',
                labelNo: 'No, go back',
                onPressYes: () => handleStatusLike(),
                onPressNo: () => setIsDialogVisible(false),
            });
        } else {
            setDialogProps({
                title: 'Like this song?',
                desc: 'This song will be played more frequently for you.',
                labelYes: 'Yes, I like it',
                labelNo: 'No, go back',
                onPressYes: () => handleStatusLike(),
                onPressNo: () => setIsDialogVisible(false),
            });
        }
        setIsDialogVisible(true);
    };

    const showDialogDislike = () => {
        if (statusLike == null) {
            setDialogProps({
                title: 'Dislike this song?',
                desc: 'This song will be played less frequently for you.',
                labelYes: 'I don’t like it',
                labelNo: 'No, go back',
                onPressYes: () => handleStatusDislike(),
                onPressNo: () => setIsDialogVisible(false),
                styleBtnYes: { backgroundColor: '#E84C4C' },
            });
        } else if (statusLike == statusLikeEnum.Medium) {
            setDialogProps({
                title: 'Dislike this song?',
                desc: 'This song will be played less frequently for you.',
                labelYes: 'I don’t like it',
                labelNo: 'No, go back',
                onPressYes: () => handleStatusDislike(),
                onPressNo: () => setIsDialogVisible(false),
                styleBtnYes: { backgroundColor: '#E84C4C' },
            });
        } else {
            setDialogProps({
                title: 'Dislike this song?',
                desc: 'This song will be played less frequently for you.',
                labelYes: 'I don’t like it',
                labelNo: 'No, go back',
                onPressYes: () => handleStatusDislike(),
                onPressNo: () => setIsDialogVisible(false),
                styleBtnYes: { backgroundColor: '#E84C4C' },
            });
        }
        setIsDialogVisible(true);
    };

    const handleStatusLike = () => {
        if (statusLike == null) {
            setStatusLike(statusLikeEnum.Medium);
        } else if (statusLike == statusLikeEnum.Medium) {
            setStatusLike(statusLikeEnum.High);
        } else {
            setStatusLike(null);
        }
        setIsDialogVisible(false);
    };

    const handleStatusDislike = () => {
        if (statusDislike == null) {
            setStatusDislike(statusLikeEnum.Medium);
        } else if (statusDislike == statusLikeEnum.Medium) {
            setStatusDislike(statusLikeEnum.High);
        } else {
            setStatusDislike(null);
        }
        setIsDialogVisible(false);
        handleViewClick();
    };
    return (
        <>
            <View style={styles.following}>
                {isVisible && (
                    <View style={styles.viewMessageDislike}>
                        <Text style={styles.messageText}>Song has been hidden in “Happy mood”.</Text>
                    </View>
                )}
                <View style={styles.followingWrapper}>
                    <TouchableOpacity style={styles.center} onPress={() => showDialogLike()}>
                        <Ionicons
                            name={statusLike !== null ? 'heart' : 'heart-outline'}
                            size={50}
                            color={statusLike !== null ? statusLike : '#222C2D'}
                        />
                        <Text>{statusLike === statusLikeEnum.High ? 'Super Like' : 'Like'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.center} onPress={() => showDialogDislike()}>
                        <Ionicons
                            name="sad-outline"
                            size={50}
                            color={statusDislike !== null ? statusDislike : '#222C2D'}
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
        justifyContent: 'center',
    },
    followingWrapper: {
        backgroundColor: '#fff',
        borderRadius: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
        paddingHorizontal: 60,
        gap: 60,
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
