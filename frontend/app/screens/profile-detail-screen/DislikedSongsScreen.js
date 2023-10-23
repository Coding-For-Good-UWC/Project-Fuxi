import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Empty from '../../components/Empty';
import playlist from '../../data/data';
import ReactSongItem from '../../components/ReactSongItem';
import CustomGridLayout from '../../components/CustomGridLayout';

const DislikedSongsScreen = () => {
    const [isEmpty, setIsEmpty] = useState(true);

    const NotEmpty = () => (
        <>
            <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, gap: 40 }}>
                    <View style={styles.section}>
                        <Text style={styles.sectionText}>Super disliked songs</Text>
                        <View style={{ flex: 1 }}>
                            <Empty label="No songs yet" style={{ marginTop: 32 }} />
                        </View>
                    </View>
                    <View style={{ borderColor: '#ECEDEE', borderTopWidth: 1 }} />
                    <View style={styles.section}>
                        <Text style={styles.sectionText}>Disliked songs</Text>
                        <View style={{ flex: 1 }}>
                            <CustomGridLayout
                                data={playlist?.tracks?.map((item, index) => (
                                    <ReactSongItem item={item} />
                                ))}
                                columns={1}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>{isEmpty ? <NotEmpty /> : <Empty label="No disliked songs yet" />}</View>
        </SafeAreaView>
    );
};

export default DislikedSongsScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
        flexDirection: 'column',
        gap: 20,
    },
    section: {
        flex: 1,
        gap: 8,
    },
    sectionText: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        color: '#3C4647',
    },
});
