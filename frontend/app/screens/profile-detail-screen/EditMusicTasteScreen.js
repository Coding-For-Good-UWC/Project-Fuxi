import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { languages } from '../../utils/Diversity';
import { Chip } from 'react-native-paper';
import { getColour } from '../../utils/BackgroundColor';

const EditMusicTasteScreen = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const toggleItem = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((selected) => selected !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    useEffect(() => {
        if (selectedItems.length < 1) {
            setIsSelected(false);
        } else {
            setIsSelected(true);
        }
    }, [selectedItems]);

    const handleSubmit = async () => {
        setIsLoading(true);
        const { nameListener, yearBirth, language } = formData;
        console.log(formData, selectedItems);
        const userUid = await getStoreData('UserUid');
        try {
            const newProfile = await createProfile(userUid, nameListener, yearBirth, language, selectedItems, null);
            const { code, message, data } = JSON.parse(newProfile);
            if (code == 201) {
                await storeData('profile0', JSON.stringify(data));
                navigation.navigate('ListenerProfileScreen3', { nameProfile: formData.nameListener, token: token });
            } else if (code == 400) {
                alert(message);
            } else {
                alert(message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Create profile unsuccessful');
            return;
        } finally {
            setIsLoading(false);
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
