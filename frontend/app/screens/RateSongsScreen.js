import { Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

const RateSongsScreen = () => {
    const [heightItem, setHeightItem] = useState(0);

    handleLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setHeightItem(width);
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={styles.scrollView}>
                    <Text style={styles.headerText}>Rate songs</Text>
                    <Text style={styles.descText}>
                        FUXI uses ... to recommend song for Persons with Dementia. In order to improve the algorithm, we
                        encourage our user to provide feedback, so that we can better our recommendation.
                    </Text>
                    <Text style={styles.descText}>
                        In the Media Player screen, there’s a section below where you can rate your song.
                    </Text>
                    <Image source={require('../assets/image4.png')} style={{ width: '100%' }} />
                    <Text style={styles.descText}>
                        If it’s the 1st time you like this song, it’ll be marked as like -> We’ll play it more
                        frequently. Next time like -> Mark as Super Like -> Play it more.
                    </Text>
                    <Text style={styles.descText}>
                        Your previous reaction won’t be shown in the Media Player to avoid bias in giving reaction.
                    </Text>
                    <Text style={styles.descText}>
                        After 30s of listening, we will remind you to rate song. The message disappears after 15 secs of
                        inactive.
                    </Text>
                    <View style={{ alignItems: 'center' }} onLayout={this.handleLayout}>
                        <Image
                            source={require('../assets/image5.png')}
                            style={{ flex: 1, width: heightItem, height: heightItem, resizeMode: 'contain' }}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RateSongsScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
        flexDirection: 'column',
        gap: 20,
    },
    headerText: {
        fontWeight: '600',
        fontSize: 24,
        lineHeight: 32,
        color: '#222C2D',
    },
    descText: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: '#3C4647',
    },
});
