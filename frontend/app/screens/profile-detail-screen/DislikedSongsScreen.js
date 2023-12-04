import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Empty from '../../components/Empty';
import ReactSongItem from '../../components/ReactSongItem';
import CustomGridLayout from '../../components/CustomGridLayout';
import { getReactTrackByProfileId } from '../../api/profileReact';

const DislikedSongsScreen = ({ setIsDialogVisible, setDialogProps, dataProfile }) => {
    const [dataReactTracks, setDataReactTracks] = useState([]);

    useEffect(() => {
        getReactTracks();
    }, []);

    async function getReactTracks() {
        try {
            const response = await getReactTrackByProfileId(dataProfile._id);
            const { code, message, data } = response;
            if (code == 200) {
                setDataReactTracks(data?.reactTracks || []);
            }
        } catch (error) {
            return;
        }
    }

    const filteredDislike = dataReactTracks?.filter((item) => item.preference === 'dislike');

    const filteredStronglyDislike = dataReactTracks?.filter((item) => item.preference === 'strongly dislike');

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, gap: 40 }}>
                        <View style={styles.section}>
                            <Text style={styles.sectionText}>Super disliked songs</Text>
                            <View style={{ flex: 1 }}>
                                {filteredStronglyDislike.length === 0 ? (
                                    <Empty label="No songs yet" style={{ marginTop: 32 }} />
                                ) : (
                                    <CustomGridLayout
                                        data={filteredStronglyDislike.map((item, index) => (
                                            <ReactSongItem
                                                item={item.track}
                                                reactTrack={item.preference}
                                                setIsDialogVisible={setIsDialogVisible}
                                                setDialogProps={setDialogProps}
                                                dataTracksOrigin={filteredStronglyDislike.map((item) => item.track)}
                                            />
                                        ))}
                                        columns={1}
                                    />
                                )}
                            </View>
                        </View>
                        <View style={{ borderColor: '#ECEDEE', borderTopWidth: 1 }} />
                        <View style={styles.section}>
                            <Text style={styles.sectionText}>Disliked songs</Text>
                            <View style={{ flex: 1 }}>
                                {filteredDislike.length === 0 ? (
                                    <Empty label="No songs yet" style={{ marginTop: 32 }} />
                                ) : (
                                    <CustomGridLayout
                                        data={filteredDislike.map((item, index) => (
                                            <ReactSongItem
                                                item={item.track}
                                                reactTrack={item.preference}
                                                setIsDialogVisible={setIsDialogVisible}
                                                setDialogProps={setDialogProps}
                                                dataTracksOrigin={filteredDislike.map((item) => item.track)}
                                            />
                                        ))}
                                        columns={1}
                                    />
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
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
        marginBottom: 88,
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
