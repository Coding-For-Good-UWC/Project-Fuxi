import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

const colorEllipse = ['#137882', '#FFC857', '#679436', '#613F75', '#FF6B6B', '#28B5B9', '#C1D43E', '#9B3D12', '#D8A7CA'];
const profileFullname = [
    'Trần Thị Hà Vi',
    'Trần Thị Mỹ Uyên',
    'Nguyễn Văn An',
    'Lê Thị Ngọc',
    'Phạm Minh Hải',
    'Bùi Hồng Lâm',
    'Lê Thị Hạnh',
    'Nguyễn Văn Nam',
    'Trần Thị Linh',
    'Phan Đình Đức',
    'Vũ Thị Thảo',
];

const AllListenerProfilesScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.headerText}>All listener profiles</Text>
                <TouchableOpacity style={styles.addNewListener} onPress={() => navigation.navigate('EditProfileNavigator')}>
                    <MaterialIcons name="person-add-alt" size={24} color={'#137882'} />
                    <Text style={styles.addNewListenerText}>Add new listener</Text>
                </TouchableOpacity>
                <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
                    <View style={styles.allProfile}>
                        {profileFullname.map((fullname, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.profileItem}
                                onPress={() => navigation.navigate('ProfileDetailNavigator', { dataProfileItem: { fullname: fullname } })}
                            >
                                <Ionicons name="ellipse" color={colorEllipse[index % colorEllipse.length]} size={16} />
                                <Text style={styles.nameProfileText} numberOfLines={1}>
                                    {fullname}
                                </Text>
                            </TouchableOpacity>
                        ))}
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
