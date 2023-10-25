import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React from 'react';
import { Chip } from 'react-native-paper';
import Empty from '../../components/Empty';

const MusicTasteScreen = ({ dataProfile }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {dataProfile?.genres?.length !== 0 ? (
                    <>
                        <Text style={styles.text}>Favorite types of music:</Text>
                        <View style={styles.listChip}>
                            {dataProfile?.genres.map((item, index) => (
                                <Chip
                                    key={index}
                                    style={styles.chipWrapper}
                                    textStyle={[
                                        styles.text,
                                        {
                                            paddingVertical: 12,
                                            paddingHorizontal: 24,
                                        },
                                    ]}
                                >
                                    {item}
                                </Chip>
                            ))}
                        </View>
                    </>
                ) : (
                    <Empty label="Not configured yet" />
                )}
            </View>
        </SafeAreaView>
    );
};

export default MusicTasteScreen;

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
    text: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        color: '#3C4647',
    },
    listChip: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    chipWrapper: {
        backgroundColor: '#fff',
        borderColor: '#DFE0E2',
        borderWidth: 1,
        borderRadius: 100,
        textAlign: 'center',
    },
});
