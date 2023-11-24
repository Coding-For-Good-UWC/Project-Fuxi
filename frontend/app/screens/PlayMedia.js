import { TouchableOpacity } from 'react-native';
import React, { useState, useLayoutEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import PlayMediaMain from './PlayMediaMain';
import PlayMediaDetailAndSuggestion from './PlayMediaDetailAndSuggestion';

const Tab = createMaterialTopTabNavigator();

const defaultSong = {
    Artist: '',
    Title: 'Choose song in playlist',
    ImageURL: require('../assets/default_l8mbsa.png'),
    URI: '',
};

const PlayMedia = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { dataTracksOrigin, currentReactTrack, playlistId } = route.params;

    const [selectSound, setSelectSound] = useState(route.params?.track || dataTracksOrigin[0] || defaultSong);
    const [dataTracks, setDataTracks] = useState(dataTracksOrigin || [selectSound]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTintColor: '#3C4647',
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-down" size={30} color={'#3C4647'} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <Tab.Navigator
            style={{ backgroundColor: '#fff' }}
            screenOptions={{
                tabBarScrollEnabled: true,
                tabBarStyle: {
                    maxWidth: 0,
                    maxHeight: 0,
                },
                android_ripple: null,
            }}
        >
            <Tab.Screen
                name="PlayMediaMain"
                options={{
                    title: '',
                    tabBarLabel: '',
                    headerShown: false,
                }}
            >
                {() => (
                    <PlayMediaMain
                        playlistId={playlistId}
                        selectSound={selectSound}
                        setSelectSound={setSelectSound}
                        dataTracks={dataTracks}
                        setDataTracks={setDataTracks}
                        currentReactTrack={currentReactTrack}
                    />
                )}
            </Tab.Screen>
            <Tab.Screen
                name="PlayMediaDetailAndSuggestion"
                options={{
                    title: '',
                    tabBarLabel: '',
                    headerShown: false,
                }}
            >
                {() => (
                    <PlayMediaDetailAndSuggestion
                        playlistId={playlistId}
                        selectSound={selectSound}
                        setSelectSound={setSelectSound}
                        dataTracks={dataTracks}
                        setDataTracks={setDataTracks}
                    />
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default PlayMedia;
