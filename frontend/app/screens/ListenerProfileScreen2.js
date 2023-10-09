import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import CustomAnimatedLoader from '../components/CustomAnimatedLoader';
import { languages } from './PatientRegistration';
import { getStoreData } from '../utils/AsyncStorage';
import { createProfile } from '../api/profiles';

const ListenerProfileScreen2 = ({ selectedItems, setSelectedItems, formData }) => {
    const navigation = useNavigation();
    const [isSelected, setIsSelected] = useState(false);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        const { nameListener, yearBirth, language } = formData;
        console.log(formData, selectedItems);
        const userUid = await getStoreData('UserUid');

        try {
            const newProfile = await createProfile(userUid, nameListener, yearBirth, language, selectedItems, null);

            const { statusCode, body } = JSON.parse(newProfile);

            if (statusCode == 201) {
                navigation.navigate('ListenerProfileScreen3', { nameProfile: formData.nameListener });
            } else if (statusCode == 400) {
                alert(body.message);
            } else {
                alert(body.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Create profile unsuccessful');
            return;
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <CustomAnimatedLoader
                visible={loading}
                source={require('../assets/loader/ellipsis-horizontal-loader.json')}
            />
            <Text style={styles.headerText}>Music taste</Text>
            <Text style={styles.descriptionText}>Please select at least 1 type that they like.</Text>
            <View style={styles.listChip}>
                {languages.map((item, index) => (
                    <Chip
                        key={index}
                        onPress={() => toggleItem(item)}
                        style={{
                            backgroundColor: selectedItems.includes(item) ? '#137882' : '#F8F8F8',
                            borderRadius: 100,
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
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: isSelected ? '#315F64' : '#EFEFF1',
                    },
                ]}
                disabled={!isSelected}
                onPress={handleSubmit}
            >
                <Text
                    style={[
                        styles.buttonText,
                        {
                            color: isSelected ? '#fff' : '#CACECE',
                        },
                    ]}
                >
                    Done
                </Text>
            </TouchableOpacity>
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
