import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React from 'react';
import { languages } from '../../utils/Diversity';
import { Chip } from 'react-native-paper';
import { getColour } from '../../utils/BackgroundColor';

const EditMusicTasteScreen = ({ selectedItems, setSelectedItems }) => {
    const toggleItem = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((selected) => selected !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.headerDesc}>Please select at least 1 type that they like.</Text>
                <View style={styles.listChip} vertical={true}>
                    {languages.map((item, index) => (
                        <Chip
                            key={index}
                            onPress={() => toggleItem(item)}
                            style={{
                                backgroundColor: selectedItems.includes(item) ? getColour(item) : '#F8F8F8',
                                borderRadius: 100,
                                textAlign: 'center',
                            }}
                            textStyle={{
                                paddingHorizontal: 24,
                                paddingVertical: 12,
                                fontSize: 16,
                                fontWeight: '500',
                                color: selectedItems.includes(item) ? '#fff' : '#3C4647',
                            }}
                        >
                            {item}
                        </Chip>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default EditMusicTasteScreen;

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
    listChip: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    headerDesc: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        color: '#3C4647',
    },
});
