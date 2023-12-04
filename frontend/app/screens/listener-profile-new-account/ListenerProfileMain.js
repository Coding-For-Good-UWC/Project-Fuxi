import { StyleSheet, Text, View, SafeAreaView, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import { useRoute } from '@react-navigation/native';
import ListenerProfileScreen1 from './ListenerProfileScreen1';
import ListenerProfileScreen2 from './ListenerProfileScreen2';
import CustomProgressBar from '../../components/CustomProgressBar';
import { AuthContext } from '../../context/AuthContext';
import { getStoreData, storeData } from '../../utils/AsyncStorage';
import { createProfile } from '../../api/profiles';
import CustomAnimatedLoader from '../../components/CustomAnimatedLoader';
import ToggleDialog from '../../components/ToggleDialog';

const ListenerProfileMain = () => {
    const route = useRoute();
    const { loginAuthContext } = useContext(AuthContext);
    const token = route.params?.token || '123asd123';
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const [currentScreen, setCurrentScreen] = useState(0);
    const [progressBarValue, setProgressBarValue] = useState(0.5);
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
        const profile0 = await getStoreData('profile0');
        if (profile0 === null) {
            const userInfo = await getStoreData('userInfo');
            const { uid, name } = JSON.parse(userInfo);
            try {
                setIsLoading(true);
                const newProfile = await createProfile(uid, name, '1950', []);
                const { code, message, data } = newProfile;
                if (code == 201) {
                    await storeData('profile0', JSON.stringify(data));
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
        }
        await loginAuthContext(token);
        alert('Welcome to FUXI');
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
            <CustomAnimatedLoader visible={isLoading} />
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
            <ToggleDialog
                visible={visible}
                title={'Unsaved profile'}
                desc={'You haven’t finished setting up this profile yet. Are you sure?'}
                labelYes={'Skip anyway'}
                labelNo={'No, go back'}
                onPressYes={handleSkip}
                onPressNo={() => setVisible(false)}
                styleBtnYes={{ backgroundColor: '#E84C4C' }}
            />
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
    skipText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#137882',
        paddingLeft: 10,
        paddingVertical: 10,
    },
});
