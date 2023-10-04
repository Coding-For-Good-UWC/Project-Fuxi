import {
    Image,
    StyleSheet,
    Text,
    View,
    Button,
    TouchableOpacity,
} from 'react-native';
import React, { useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import colours from '../config/colours';

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.headerName}>FUXI</Text>
                <Text style={styles.headerAbout}>A music therapy app</Text>
                <Text style={styles.headerAbout}>for dementia treatmemt</Text>
                <TouchableOpacity
                    style={styles.headerMoreAbout}
                    onPress={() => navigation.navigate('AboutFUXI')}
                >
                    <Text style={styles.headerMoreAboutText}>
                        More about FUXI
                    </Text>
                    <Ionicons
                        name="arrow-forward-outline"
                        size={18}
                        color={colours.deepTurquoise}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.headerMoreAbout}
                    onPress={() => navigation.navigate('PlayMedia')}
                >
                    <Text style={styles.headerMoreAboutText}>PlayMedia</Text>
                    <Ionicons
                        name="arrow-forward-outline"
                        size={18}
                        color={colours.deepTurquoise}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.center}>
                <TouchableOpacity
                    style={styles.toggleActive}
                    onPress={() => navigation.navigate('ListenerProfileMain')}
                >
                    <Text style={styles.activeText}>Create new account</Text>
                </TouchableOpacity>
                <View style={styles.toggleInactive}>
                    <Text style={styles.inactiveText}>
                        I already have an account
                    </Text>
                </View>
            </View>
            <View style={styles.footer}>
                <View style={styles.backgroundFooter}></View>
                <Text style={styles.footerText}>Created by</Text>
                <Text style={styles.footerText}>
                    <Text style={{ fontWeight: '600' }}>UWCSEA</Text> and
                    <Text style={{ fontWeight: '600' }}> Coding for Good</Text>
                </Text>
                <View style={styles.footerViewImg}>
                    <Image
                        source={require('../assets/UWC.png')}
                        style={styles.img}
                    />
                    <Image
                        source={require('../assets/CodingforGoodLogo.png')}
                    />
                </View>
            </View>
        </View>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    header: {
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerName: {
        fontSize: 70,
        fontWeight: 'bold',
        color: colours.deepTurquoise,
        letterSpacing: 8,
    },
    headerAbout: {
        fontSize: 16,
        color: colours.gray,
    },
    headerMoreAbout: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    headerMoreAboutText: {
        fontSize: 18,
        marginRight: 6,
        color: colours.deepTurquoise,
    },
    center: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleActive: {
        backgroundColor: colours.deepTurquoise,
        borderRadius: 50,
        marginBottom: 10,
    },
    toggleInactive: {},
    activeText: {
        paddingHorizontal: 60,
        paddingVertical: 20,
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    inactiveText: {
        paddingHorizontal: 60,
        paddingVertical: 20,
        color: '#222C2D',
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        flex: 1,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0F9FA',
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
    },
    footerText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3C4647',
    },
    footerViewImg: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        width: 200,
        marginTop: 10,
    },
    img: {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
    },
});
