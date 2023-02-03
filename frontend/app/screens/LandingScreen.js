import React from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    Button, 
    TouchableOpacity, 
    Image
} from 'react-native';

import colours from '../config/colours.js'; 

function LandingScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Project FUXI</Text>
            </View>
            <Image style={styles.image} source={require("../assets/fuxiIcon.png")} />
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigation.navigate("Login")}
                underlayColor={colours.highlight}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: 
    {
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: colours.bg
    }, 
    titleContainer: 
    {
        borderBottomWidth: 4,
        borderBottomColor: colours.highlight, 
        marginBottom: 20, 
    }, 
    titleText: 
    {
        fontSize: 40, 
        color: colours.text, 
        // lineHeight: 70
        paddingBottom: 20, 
        fontWeight: '500'
    }, 
    image: 
    {
        height: 100, 
        aspectRatio: 1, 
        marginBottom: 70
    }, 
    buttonContainer:
    {
        backgroundColor: colours.button,
        borderRadius: 10,
        width: 100, 
        height: 40, 
        display: 'flex', 
        alignItems: "center", 
        justifyContent: "center", 
    },
    buttonText:
    {
        color:colours.light,
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10, 
        fontSize: 18, 
        fontWeight: '450'
    }
})



// const styles = StyleSheet.create({
//     container: 
//     {
//         flex: 1, 
//         flexDirection: 'row',
//         // alignItems: 'center', 
//         // justifyContent: 'center', 
//     },
//     left: 
//     {
//         flex: 1, 
//         // backgroundColor: "red", 
//         alignItems: 'center', 
//         justifyContent: 'center', 
//     }, 
//     image: 
//     {
//         width: 100, 
//         height: 100, 
//     }, 
//     right: 
//     {
//         flex: 1.5, 
//         // backgroundColor: "orange", 
//         alignItems: 'center', 
//         justifyContent: 'center', 
//     }, 
//     title: 
//     {
//         // fontFamily: 
//         fontSize: 30
//     },
// })

export default LandingScreen;



// import React, { useState, useRef } from 'react';

// // import { useWindowDimensions } from 'react-native'

// import {
//    StyleSheet,
//    Text,
//    Button,
//    View,
//    Image, 
//    ScrollView, 
//    FlatList, 
//    Dimensions,
//    TouchableOpacity, 
//    Animated, 
// } from 'react-native';
 
// import colours from '../config/colours.js';

// const carouselImages = [
//     require("../assets/carousel-images/image-1.jpg"), 
//     require("../assets/carousel-images/image-2.jpeg"), 
//     require("../assets/carousel-images/image-3.jpg"), 
//     require("../assets/carousel-images/image-4.jpg")
// ]

// const items2 = [
//     'https://images.unsplash.com/photo-1624144284128-d476c9231c91?ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//     'https://images.unsplash.com/photo-1555169062-013468b47731?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8YmlyZHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//     'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTJ8fHdpbnRlcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//     'https://images.unsplash.com/photo-1512819432727-dbcb57a06f13?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGJpcmR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//     'https://images.unsplash.com/photo-1431036101494-66a36de47def?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTV8fHdpbnRlcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//     'https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmlyZHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
// 'https://images.unsplash.com/photo-1528701790053-56b0f31e4577?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NzR8fHdpbnRlcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//     'https://images.unsplash.com/photo-1605092675701-0dafa674328e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTB8fGJpcmR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
// //     'https://images.unsplash.com/photo-1597132990170-ec6f7d86e731?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NDV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
// //     'https://images.unsplash.com/photo-1551582045-6ec9c11d8697?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8d2ludGVyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
// //     'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjh8fHdpbnRlcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
// //     'https://images.unsplash.com/photo-1612024782955-49fae79e42bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
// ]

// const { width, height } = Dimensions.get("window"); 

// function LandingScreen({ navigation }) 
// {
//     // const { height, width } = useWindowDimensions();
//     // const CARD_WIDTH = width * 0.9;
//     // const CARD_HEIGHT = CARD_WIDTH * 1.6;

//     const scrollX = useRef(new Animated.Value(0)).current; 


//     const [currentCarouselIndex, setCurrentCarouselIndex] = useState (0); 
//     // const scrollX = useRef(new Animated.Value(0)).current; 

//     const updateCarouselBullets = ({nativeEvent}) => 
//     {
//         const slide = Math.floor(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width); 
//         if (slide !== currentCarouselIndex)
//             setCurrentCarouselIndex (slide); 
//     }

//     const items = carouselImages.map ((image, index) => 
//     (
//         <View style={styles.carouselImageView} key={index}>
//             <Animated.Image source={image} style={[styles.carouselImage, {
//                 // transform: [
//                 //     {
//                 //         translateX: scrollX.interpolate({inputRange: [(index - 1) * width, index * width, (index + 1) * width], outputRange: [-width * 0.7, 0, width * 0.7]})
//                 //     }, 
//                 // ]
//             }]}>
//             </Animated.Image>
//         </View>
//     )); 

//     return (
//         <View style={styles.container}>
//             <View style={styles.carouselContainer} pointerEvents={'auto'}>
//                 <Animated.ScrollView 
//                     pagingEnabled
//                     horizontal
//                     bounces={false}
//                     showsHorizontalScrollIndicator={false}
//                     style={styles.carouselScrollView}
//                     onScroll={updateCarouselBullets}
//                     // onScroll={[updateCarouselBullets, Animated.event(
//                     //     [{ nativeEvent: { contentOffset: { x: scrollX } } }], 
//                     //     { useNativeDriver: true }
//                     // )]}
//                 >
//                     { items }
//                 </Animated.ScrollView>
//                 <View style={styles.carouselBulletContainer}>
//                     {
//                         carouselImages.map ((item, index) => <Text style={index == currentCarouselIndex ? styles.carouselBulletActive : styles.carouselBullet} key={index}>⬤</Text>)
//                     }
//                 </View>
//                 <View style={styles.carouselOverlay} pointerEvents={'none'}>
//                     <Text style={styles.titleText}>Project FUXI</Text>
//                 </View>
//             </View>
//             <View style={styles.bodyContainer}>
//                 <View style={styles.bodyCard}>
//                     <View style={styles.fuxiImageContainer}>
//                         <Image source={require('../assets/fuxiIcon.png')} style={styles.fuxiImage} />
//                     </View>
//                     <View style={styles.descriptionContainer}>
//                         <Text style={styles.subtitleText}>Project FUXI</Text>
//                         <Text numberOfLines={10} style={styles.descriptionText}>Project Fuxi is an initiative aiming to increaes the quality of life of dementia patients through the use of Music Therapy. Music, combined with detailed data collection, autobiographical information, and user-friendly solutions, can have a significant impact on the well-being of those with dementia. As the areas of the brain that process musical memory are some of the last to be affected, carefully curated and individualised music can encourage brain activity and animate those who would otherwise be quiet and confused.</Text>
//                         <Button 
//                             title="Login" 
//                             color={colours.blue}
//                             onPress={() => navigation.navigate("Login")}
//                         />
//                     </View>
//                 </View>
//             </View>
//             <View style={styles.parallaxContainer}>
//                 <Image source={require ('../assets/carousel-images/parallax-image.jpeg')} style={styles.parallaxImage} />
//             </View>

//             <View style={styles.bodyContainer}>
//                 <View style={styles.bodyCard}>
                    
//                 </View>
//             </View>
//        </View>
//    );
// }
 
// const styles = StyleSheet.create({
//     container: 
//     {
//         flex: 1
//     }, 
//     carouselContainer: 
//     {
//         width: "100%", 
//         height: height 
//     },  
//     carouselScrollView: 
//     {
//         width: "100%", 
//         height: "100%"
//     }, 
//     carouselImageView: 
//     {
//         width: Dimensions.get('window').width, 
//         height: "100%", 
//         overflow: 'hidden', 
//         alignItems: 'center', 
//     },  
//     carouselImage: 
//     {
//         width: Dimensions.get('window').width, 
//         // width: Dimensions.get('window').width * 1.4, 
//         height: "100%", 
//         resizeMode: 'cover', 
//     }, 
//     carouselBulletContainer: 
//     {
//         flexDirection: 'row', 
//         position: 'absolute', 
//         bottom: 20, 
//         alignSelf: 'center', 
//     }, 
//     carouselBullet: 
//     {
//         color: '#888', 
//         margin: 3
//     }, 
//     carouselBulletActive: 
//     {
//         color: '#fff', 
//         margin: 3
//     }, 
//     carouselOverlay: 
//     {
//         height: "100%",
//         width: "100%",
//         position: 'absolute',
//         backgroundColor: 'rgba(0, 0, 0, 0.6)', 
//         flex: 1, 
//         justifyContent: 'center', 
//         alignItems: 'center'
//         // pointer-events: none; 
//     }, 
//     titleText: 
//     {
//         color: "white",
//         fontWeight: 'bold', 
//         letterSpacing: 5,  
//         fontSize: 100, 
//         paddingBottom: 100
//     }, 

//     bodyContainer: 
//     {
//         backgroundColor: colours.bg, 
//         height: 660, 
//         paddingLeft: "10%", 
//         paddingRight: "10%", 
//         paddingTop: "7%", 
//         paddingBottom: "7%", 
//         width: "100%", 
//     }, 
//     bodyCard: 
//     {
//         backgroundColor: colours.charcoal, 
//         flexDirection: 'row', 
//         borderRadius: 15, 
//         shadowColor: 'black',
//         shadowOffset: { width: 10, height: 15 },
//         shadowRadius: 5,
//         shadowOpacity: 0.3, 
//         paddingLeft: "5%", 
//         paddingRight: "5%", 
//         width: "100%", 
//         height: "100%"
//     }, 
//     fuxiImageContainer: 
//     {
//         flex: 1, 
//         // backgroundColor: "green", 
//         justifyContent: 'center', 
//         alignItems: 'center'
//     }, 
//     fuxiImage: 
//     {
//         width: "100%", 
//         aspectRatio: 1
//     }, 
//     descriptionContainer: 
//     {
//         flex: 2, 
//         // backgroundColor: "red", 
//         // justifyContent: 'center', 
//         paddingTop: "5%"
//     }, 
//     subtitleText: 
//     {
//         color: colours.text, 
//         fontSize: 30, 
//         fontWeight: 'bold', 
//         paddingBottom: 20
//     }, 
//     descriptionText: 
//     {
//         color: colours.text, 
//         fontSize: 23, 
//         lineHeight: 30, 
//         paddingBottom: 20
//     }, 
//     parallaxContainer: 
//     {
//         height: 800, 
//         width: "100%", 
//     }, 
//     parallaxImage: 
//     {
//         resizeMode: 'cover', 
//         width: "100%", 
//         height: "100%"
//     }
// });
 
// export default LandingScreen; 
