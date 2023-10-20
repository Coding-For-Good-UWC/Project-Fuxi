import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { languages } from '../utils/Diversity';
import { getStoreData, storeData } from '../utils/AsyncStorage';
import { createProfile } from '../api/profiles';
import colours from '../config/colours.js';
import ToggleButton from './../components/ToggleButton';
import CustomAnimatedLoader from '../components/CustomAnimatedLoader';

const ListenerProfileScreen2 = ({ selectedItems, setSelectedItems, formData, token }) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [isSelected, setIsSelected] = useState(false);

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

    const getColour = (genre) => {
        switch (genre) {
            case 'Cantonese':
                return colours.genreCantonese;
            case 'Chinese':
                return colours.genreChinese;
            case 'Christian':
                return colours.genreChristian;
            case 'English':
                return colours.genreEnglish;
            case 'Hainanese':
                return colours.genreHainanese;
            case 'Hindi':
                return colours.genreHindi;
            case 'Hokkien':
                return colours.genreHokkien;
            case 'Malay':
                return colours.genreMalay;
            case 'Mandarin':
                return colours.genreMandarin;
            case 'TV':
                return colours.genreTV;
            case 'Tamil':
                return colours.genreTamil;
            default:
                return '#137882';
        }
    };

    return (
        <View style={styles.container}>
            <CustomAnimatedLoader visible={isLoading} />
            <Text style={styles.headerText}>Music taste</Text>
            <Text style={styles.descriptionText}>Please select at least 1 type that they like.</Text>
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
            <ToggleButton
                isDisabled={isSelected}
                onPress={handleSubmit}
                lable="Done"
                backgroundColorActive="#315F64"
                backgroundColorInactive="#EFEFF1"
                colorActive="#fff"
                colorInactive="#CACECE"
                styleButton={{
                    marginTop: 'auto',
                    marginBottom: 24,
                }}
            />
        </View>
    );
};

export default ListenerProfileScreen2;

const styles = StyleSheet.create({
    container: {
        height: '93%',
        paddingTop: 40,
        padding: 30,
    },
    headerText: {
        fontSize: 24,
        color: '#222C2D',
        fontWeight: '600',
        marginBottom: 8,
        lineHeight: 32,
    },
    descriptionText: {
        fontSize: 16,
        color: '#3C4647',
        fontWeight: '400',
        lineHeight: 24,
        marginBottom: 20,
    },
    listChip: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    button: {
        borderRadius: 100,
        marginTop: 'auto',
        marginBottom: 6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
});
