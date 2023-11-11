import { StyleSheet, Text, View, SafeAreaView, StatusBar, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useContext, useState } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import Dialog from 'react-native-dialog';
import { useRoute } from '@react-navigation/native';
import ListenerProfileScreen1 from './ListenerProfileScreen1';
import ListenerProfileScreen2 from './ListenerProfileScreen2';
import CustomProgressBar from '../../components/CustomProgressBar';
import { AuthContext } from '../../context/AuthContext';

const ListenerProfileMain = () => {
    const route = useRoute();
    const { loginAuthContext } = useContext(AuthContext);
    const token = route.params?.token || '123asd123';
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const [currentScreen, setCurrentScreen] = useState(0);
    const [progressBarValue, setProgressBarValue] = useState(0.5);
    const [visible, setVisible] = useState(false);

    const resetState = () => {
        setCurrentScreen(0);
        setProgressBarValue(0.5);
        setFormData({
            nameListener: '',
            yearBirth: '',
        });
        setErrors({
            nameListener: '',
            yearBirth: '',
        });
        setSelectedItems([]);
    };

    const [formData, setFormData] = useState({
        nameListener: '',
        yearBirth: '',
    });

    const [errors, setErrors] = useState({
        nameListener: '',
        yearBirth: '',
    });

    const [selectedItems, setSelectedItems] = useState([]);

    const handleSkip = async () => {
        setVisible(false);
        await loginAuthContext(token);
        ToastAndroid.showWithGravityAndOffset('Welcome to FUXI', ToastAndroid.LONG, ToastAndroid.CENTER, 0, Dimensions.get('window').height * 0.8);
    };

    const screens = [
        <ListenerProfileScreen1
            goToScreen={() => {
                setCurrentScreen(1);
                setProgressBarValue(0.9);
            }}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
        />,
        <ListenerProfileScreen2
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            formData={formData}
            token={token}
            resetState={resetState}
        />,
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.progressBar}>
                <CustomProgressBar
                    progress={progressBarValue}
                    height={7}
                    color="#137882"
                    backgroundColor="#ddeced"
                    radius={9}
                    duration={250}
                    progressStyle={{ width: '90%' }}
                />
                <TouchableOpacity style={styles.skip} onPress={() => setVisible(true)}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>
            <Carousel
                loop={false}
                enabled={false}
                width={width}
                height={height}
                data={[screens[0]]}
                scrollAnimationDuration={0}
                onSnapToItem={(index) => setCurrentScreen(index)}
                renderItem={({ item }) => <View style={{ flex: 1 }}>{screens[currentScreen]}</View>}
            />
            <View style={styles.dialog}>
                <Dialog.Container visible={visible}>
                    <Dialog.Title style={styles.dialogTitle}>Unsaved profile</Dialog.Title>
                    <Dialog.Description style={styles.dialogDescription}>
                        You haven’t finished setting up this profile yet. Are you sure?
                    </Dialog.Description>
                    <Dialog.Button style={styles.dialogButtonNo} label="No, go back" onPress={() => setVisible(false)} />
                    <Dialog.Button style={styles.dialogButtonYes} label="Skip anyway" onPress={handleSkip} />
                </Dialog.Container>
            </View>
        </SafeAreaView>
    );
};

export default ListenerProfileMain;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    progressBar: {
        marginTop: 20,
        paddingHorizontal: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    skip: {},
    skipText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#137882',
        paddingLeft: 10,
        paddingVertical: 10,
    },
    dialogTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: '#1D1B20',
    },
    dialogDescription: {
        fontSize: 14,
        fontWeight: '400',
        color: '#49454F',
        marginBottom: 10,
    },
    dialogButtonNo: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3C4647',
    },
    dialogButtonYes: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        backgroundColor: '#E84C4C',
        borderRadius: 100,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginLeft: 24,
    },
});
