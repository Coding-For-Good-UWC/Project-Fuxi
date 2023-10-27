import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import React, { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/core';

const SettingScreen = () => {
    const navigation = useNavigation();
    const { logoutAuthContext } = useContext(AuthContext);

    const handleLogOut = () => {
        logoutAuthContext();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Text style={styles.headerText}>Settings</Text>
                    <View style={styles.sectionView}>
                        <Text style={styles.textHeaderSection}>Listener profiles management</Text>
                        <View style={styles.sectionContainer}>
                            <TouchableOpacity style={styles.sectionRowItem} onPress={() => navigation.navigate('AllListenerProfilesScreen')}>
                                <Ionicons name="person-outline" color={'#757575'} size={20} style={styles.iconItem} />
                                <Text style={styles.sectionRowItemText}>All listener profiles</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <View style={styles.sectionView}>
                        <Text style={styles.textHeaderSection}>Account</Text>
                        <View style={styles.sectionContainer}>
                            <TouchableOpacity style={styles.sectionRowItem} onPress={() => navigation.navigate('ResetPassword')}>
                                <Ionicons name="key-outline" color={'#757575'} size={20} style={styles.iconItem} />
                                <Text style={styles.sectionRowItemText}>Change password</Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}
                    <View style={styles.sectionView}>
                        <Text style={styles.textHeaderSection}>Other</Text>
                        <View style={styles.sectionContainer}>
                            <TouchableOpacity style={styles.sectionRowItem} onPress={() => navigation.navigate('AboutFUXI')}>
                                <Ionicons name="information-circle-outline" color={'#757575'} size={20} style={styles.iconItem} />
                                <Text style={styles.sectionRowItemText}>About FUXI</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.sectionRowItem} onPress={() => navigation.navigate('TermsAndConditions')}>
                                <MaterialIcons name="gavel" color={'#757575'} size={20} style={styles.iconItem} />
                                <Text style={styles.sectionRowItemText}>Terms & Conditions</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sectionRowItem} onPress={() => navigation.navigate('PrivacyPolicy')}>
                                <MaterialCommunityIcons name="shield-search" color={'#757575'} size={20} style={styles.iconItem} />
                                <Text style={styles.sectionRowItemText}>Privacy Policy</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity style={styles.sectionRowItem} onPress={() => navigation.navigate('Feedback')}>
                                <Ionicons name="pencil-outline" color={'#757575'} size={20} style={styles.iconItem} />
                                <Text style={styles.sectionRowItemText}>Feedback</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.sectionRowItem}>
                                <Ionicons name="help-circle-outline" color={'#757575'} size={20} style={styles.iconItem} />
                                <Text style={styles.sectionRowItemText}>Help</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity style={styles.sectionRowItem} onPress={handleLogOut}>
                                <Ionicons name="log-out-outline" color={'#757575'} size={20} style={styles.iconItem} />
                                <Text style={styles.sectionRowItemText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        paddingVertical: 24,
        paddingHorizontal: 20,
        flexDirection: 'column',
        gap: 20,
    },
    headerText: {
        fontWeight: '600',
        fontSize: 30,
        lineHeight: 36,
        color: '#222C2D',
    },
    sectionView: {
        flexDirection: 'column',
        gap: 12,
    },
    textHeaderSection: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        color: '#222C2D',
    },
    sectionContainer: {
        flexDirection: 'column',
        gap: 16,
    },
    sectionRowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconItem: {
        padding: 12,
        backgroundColor: '#F8F8F8',
        borderRadius: 100,
    },
    sectionRowItemText: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: '#222C2D',
    },
});
