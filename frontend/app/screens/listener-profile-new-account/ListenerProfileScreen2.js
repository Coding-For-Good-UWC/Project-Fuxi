import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { languages } from '../../utils/Diversity';
import { getStoreData, storeData } from '../../utils/AsyncStorage';
import { createProfile } from '../../api/profiles';
import ToggleButton from '../../components/ToggleButton';
import CustomAnimatedLoader from '../../components/CustomAnimatedLoader';
import { getColour } from '../../utils/BackgroundColor';
import { createProfileReact } from '../../api/profileReact';

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
        const json = await getStoreData('userInfo');
        const { uid } = JSON.parse(json);
        try {
            const newProfile = await createProfile(uid, nameListener.trim(), yearBirth, selectedItems, null);
            const { code, message, data } = JSON.parse(newProfile);
            await createProfileReact(data._id, []);
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
