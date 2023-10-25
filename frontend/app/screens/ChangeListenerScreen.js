import { Dimensions, Platform, SafeAreaView, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { getStoreData, storeData } from '../utils/AsyncStorage';
import CustomGridLayout from '../components/CustomGridLayout';
import { getAllProfilesByInstituteUId, getProfileById } from '../api/profiles';
import { colorEllipse } from '../utils/BackgroundColor';

const ChangeListenerScreen = ({ visible }) => {
    const [dataListener, setDataListener] = useState([]);

    const handleChangeProfile = async (item) => {
        const response = await getProfileById(item._id);
        const { code, message, data } = JSON.parse(response);
        if (code == 200) {
            console.log(data.fullname);
            await storeData('profile0', JSON.stringify(data));
        }
    };

    async function getAllProfile() {
        try {
            const userInfo = await getStoreData('userInfo');
            const { uid } = JSON.parse(userInfo);
            const response = await getAllProfilesByInstituteUId(uid);
            const { code, message, data } = JSON.parse(response);
            if (code == 200) {
                setDataListener(data);
            }
        } catch (error) {
            alert(error.message);
            return;
        }
    }

    const ListenerItem = ({ data, onPress, index }) => (
        <>
            <View style={styles.listenerItem}>
                <Ionicons name="ellipse" color={colorEllipse[index % colorEllipse.length]} size={20} />
                <Text style={styles.nameListener} numberOfLines={1}>
                    {data.fullname}
                </Text>
                <TouchableOpacity onPress={onPress}>
                    <Text style={styles.selectText}>Select</Text>
                </TouchableOpacity>
            </View>
        </>
    );

    useEffect(() => {
        getAllProfile();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <Animatable.View animation="fadeIn" duration={500} style={styles.container}>
                <Text style={styles.headerText}>Change listener</Text>
                <View style={styles.listenerList}>
                    <CustomGridLayout
                        data={dataListener.map((item, index) => (
                            <ListenerItem key={index} index={index} data={item} onPress={() => handleChangeProfile(item)} />
                        ))}
                        columns={1}
                        gap={12}
                    />
                </View>
                <Text style={styles.note}>
                    Manage profiles in
                    <Text style={styles.hightlineNote}>{` Settings > Listener Profiles.`}</Text>
                </Text>
            </Animatable.View>
            <TouchableOpacity style={styles.closeBtn} onPress={visible}>
                <Ionicons name="close" color={'#757575'} size={24} style={styles.iconClose} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ChangeListenerScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        opacity: 0.98,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        alignItems: 'center',
    },
    container: {
        flex: 1,
        position: 'absolute',
        bottom: '10%',
        padding: 20,
        flexDirection: 'column',
        gap: 18,
        width: '100%',
        backgroundColor: '#fff',
    },
    headerText: {
        fontWeight: '600',
        fontSize: 20,
        lineHeight: 28,
        color: '#222C2D',
    },
    listenerList: {
        flexDirection: 'column',
    },
    listenerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        gap: 8,
        borderColor: '#ECEDEE',
        borderWidth: 1,
        borderRadius: 6,
    },
    nameListener: {
        flex: 1,
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        color: '#222C2D',
    },
    selectText: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        color: '#137882',
        padding: 4,
        paddingRight: 0,
    },
    note: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 20,
        color: '#757575',
    },
    hightlineNote: {
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 20,
        color: '#3C4647',
    },
    closeBtn: {
        position: 'absolute',
        bottom: 28,
        height: 56,
        width: 56,
        borderRadius: 100,
        borderColor: '#DFE0E2',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
