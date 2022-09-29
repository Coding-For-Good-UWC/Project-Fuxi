import React from 'react';
import { 
    StyleSheet, 
    Text, 
    Button, 
    View
} from 'react-native';

import colours from '../config/colours.js'; 

function LandingScreen({ navigation }) {
    return (
        <View>
            <Text>LANDING</Text>
            <Button
                title="Login"
                onPress={() => navigation.navigate("Login")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    
})

export default LandingScreen;