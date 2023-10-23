import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

const AllListenerProfilesScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.headerText}>All listener profiles 1</Text>
                <TouchableOpacity style={styles.addNewListener}>
                    <MaterialIcons name="person-add-alt" size={24} color={'#137882'} />
                    <Text style={styles.addNewListenerText}>Add new listener</Text>
                </TouchableOpacity>
                <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
                    <View style={styles.allProfile}>
                        <TouchableOpacity style={styles.profileItem} onPress={() => navigation.navigate('ProfileDetailNavigator')}>
                            <Ionicons name="ellipse" color={'#137882'} size={16} />
                            <Text style={styles.nameProfileText} numberOfLines={1}>
                                ninaazarova
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default AllListenerProfilesScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 52 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
    },
    container: {
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
    addNewListener: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 6,
        borderColor: '#B1D5D8',
        borderWidth: 1,
        gap: 8,
    },
    addNewListenerText: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        color: '#137882',
    },
    allProfile: {
        flex: 1,
        flexDirection: 'column',
        gap: 20,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderRadius: 6,
        borderColor: '#ECEDEE',
        borderWidth: 1,
        gap: 8,
    },
    nameProfileText: {
        flex: 1,
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        color: '#222C2D',
    },
});
