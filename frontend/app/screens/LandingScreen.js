import React from 'react';
import { 
    StyleSheet, 
    Text, 
    Button, 
    View,
    Animated,  
    Pressable,
    Image
} from 'react-native';

function LandingScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.title}>Project Fuxi</Text>
                <Text style={styles.bodyText}>The unanimous Declaration of the thirteen united States of America, When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation. We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness. </Text>
                <Image source={require("../assets/fuxiIcon.png")} style={styles.image}/>
            </View>
            <View style={styles.bottom}>
                {/* <button style={styles.button}>
                    <Text style={styles.buttonText}>LOGIN</Text>
                </button> */}

                <Button 
                    title="Login" 
                    // style={styles.button}
                    onPress={() => navigation.navigate("Login")}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create( {
    container: 
    {
        width: "100%",
        height: "100%",
        flex: 1,
        alignItems: 'center',
    },
    top: {
        flex: 5,
        backgroundColor: '#dde6d5',
        width: "100%",
        height: "100%",
        fontSize: 20,
    },
    image: {
        justifyContent: 'right',
        marginLeft: '115px',
        alignItems: 'center',
        marginTop: '-330px',
        width: 315, 
        height: 445,
    },
    title: {
        paddingLeft: '35%',
        fontSize: 70,
        marginTop: '7px', 
        fontFamily:'PingFang TC',
        color: '#0f1f13',
        textShadowColor: '#3c6948',
        textShadowRadius: 25,
        textShadowOffset: 0
    },

    bodyText: {
        marginRight: 90, 
        marginLeft: 470, 
        marginTop: 50, 
        fontFamily: 'PingFang TC', 
        fontSize: 19,
        color: '#0f1f13',
    },
    Text: {
        color: 'black',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent:'center',
        fontSize: 75,
        marginRight: 50,
        marginLeft: 50,
        fontFamily: 'PingFang TC'
    },
    Text2: {
        marginRight: 50,
        marginLeft: 50,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#3c6948',
        fontFamily: 'PingFang TC',
        paddingLeft: '25px',
        paddingRight: '25px',
        paddingTop: '15px',
        paddingBottom: '15px'
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
        color: 'antiquewhite',
        fontFamily: 'PingFang TC',
    },
    bottom: {
        flex: 0.9,
        backgroundColor: '#000a03',
        color: 'white', 
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        height: "100%"
    },
});

export default LandingScreen;




// import React from 'react';
// import { 
//     StyleSheet, 
//     View, 
//     Text, 
//     Button
// } from 'react-native';

// import colours from '../config/colours.js'; 

// function LandingScreen({ navigation }) {
//     return (
//         <View style={styles.container}>
//             <Button 
//                 title="Login"
//                 onPress={() => navigation.navigate("Login")}/>
//             <Button 
//                 title="Player"
//                 onPress={() => navigation.navigate("Player")}/>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: 
//     {
//         flex: 1, 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         backgroundColor: "lightblue", 
//     }, 
// })



// // const styles = StyleSheet.create({
// //     container: 
// //     {
// //         flex: 1, 
// //         flexDirection: 'row',
// //         // alignItems: 'center', 
// //         // justifyContent: 'center', 
// //     },
// //     left: 
// //     {
// //         flex: 1, 
// //         // backgroundColor: "red", 
// //         alignItems: 'center', 
// //         justifyContent: 'center', 
// //     }, 
// //     image: 
// //     {
// //         width: 100, 
// //         height: 100, 
// //     }, 
// //     right: 
// //     {
// //         flex: 1.5, 
// //         // backgroundColor: "orange", 
// //         alignItems: 'center', 
// //         justifyContent: 'center', 
// //     }, 
// //     title: 
// //     {
// //         // fontFamily: 
// //         fontSize: 30
// //     },
// // })

// export default LandingScreen;