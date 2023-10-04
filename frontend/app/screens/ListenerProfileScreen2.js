import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Chip } from 'react-native-paper';
import { languages } from './PatientRegistration';
import { useNavigation } from '@react-navigation/native';

const ListenerProfileScreen2 = () => {
    const navigation = useNavigation();
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSelected, setIsSelected] = useState(false);

    const toggleItem = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(
                selectedItems.filter((selected) => selected !== item),
            );
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

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Music taste</Text>
            <Text style={styles.descriptionText}>
                Please select at least 1 type that they like.
            </Text>
            <View style={styles.listChip}>
                {languages.map((item, index) => (
                    <Chip
                        key={index}
                        onPress={() => toggleItem(item)}
                        style={{
                            backgroundColor: selectedItems.includes(item)
                                ? '#137882'
                                : '#F8F8F8',
                            borderRadius: 100,
                        }}
                        textStyle={{
                            paddingHorizontal: 24,
                            paddingVertical: 12,
                            fontSize: 16,
                            fontWeight: '500',
                            color: selectedItems.includes(item)
                                ? '#fff'
                                : '#3C4647',
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
                onPress={() => {
                    console.log(selectedItems);
                    navigation.navigate('ListenerProfileScreen3');
                }}
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
