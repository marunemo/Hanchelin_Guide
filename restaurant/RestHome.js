import React, { Component, useState, useEffect } from "react";
import {
    Text,
    View,
    Image,
    ScrollView,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from "react-native"
import { Center, VStack, NativeBaseProvider } from "native-base";
import database from '@react-native-firebase/database';
import RestInfo from './ListItem.js';
import { createStackNavigator } from '@react-navigation/stack';
import resJson from "./resData";

resData = resJson["식당"];

var arr = []
Object.keys(resData).forEach(key => arr.push({
    name: key,
    dong: resData[key].dong,
    likes: resData[key].likes,
    bookmark_count: resData[key].bookmark_count
}))
console.log(arr);

class Home extends Component {
    render() {
        return (
            <NativeBaseProvider>
                <Center flex={1}>
                    <ScrollView width="100%">
                        <VStack my={0.5} space={0.5} alignItems="center">
                            {arr.map((item) => (
                                // <Button
                                //     width="100%"
                                //     height={100}
                                //     onPress={() => this.props.navigation.navigate('식당 정보', { resName: val })}
                                //     bgColor="white"
                                //     _text={{
                                //         fontSize: "md",
                                //         color: "darkText",
                                //     }}
                                // >
                                <TouchableOpacity
                                    style={styles.itemContainer}
                                    onPress={() => this.props.navigation.navigate('식당 정보', { resName: item.name })}>
                                    <View style={styles.itemLogo}>
                                        <Image
                                            style={styles.itemImage}
                                            source={require('../images/none.jpeg')}
                                        />
                                    </View>
                                    <View style={styles.itemBody}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text>{item.dong}</Text>
                                    </View>
                                    <View style={styles.itemIconBody}>
                                        <Text style={styles.itemLike}>
                                            <Image
                                                style={styles.itemIcon}
                                                source={{ uri: 'https://i.pinimg.com/originals/39/44/6c/39446caa52f53369b92bc97253d2b2f1.png' }}
                                            /> {item.likes} </Text>
                                        <Text style={styles.itemLike}>
                                            <Image
                                                style={styles.itemIcon}
                                                source={{ uri: 'https://cdn3.vectorstock.com/i/1000x1000/31/77/star-icon-isolated-on-background-modern-simple-sp-vector-21073177.jpg' }}
                                            /> {item.bookmark_count} </Text>
                                        <Text style={styles.itemLike}>
                                            <Image
                                                style={styles.itemIcon}
                                                source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5osTFTdlco7oBcppJ5-StA8r9ZhY8rfug3Q&usqp=CAU' }}
                                            /> {item.bookmark_count} </Text>
                                    </View>
                                </TouchableOpacity>
                                // </Button>
                            ))}
                        </VStack>
                    </ScrollView>
                </Center>
            </NativeBaseProvider>
        )
    }
}

const Stack = createStackNavigator();

export default function RestStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="식당 리스트" component={Home} />
            <Stack.Screen name="식당 정보" component={RestInfo} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    listTab: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 5
    },
    menuTab: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 10
    },
    btnTab: {
        width: Dimensions.get('window').width / 3.5,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#EBEBEB',
        padding: 10,
        justifyContent: 'center'
    },
    btnMenuTab: {
        width: Dimensions.get('window').width / 8,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#EBEBEB',
        padding: 10,
        justifyContent: 'center'
    },
    textTab: {
        fontSize: 16
    },
    textMenuTab: {
        fontSize: 10
    },
    btnTabActive: {
        backgroundColor: 'gray'//'#E6838D'
    },
    itemContainer: {
        flexDirection: 'row',
        paddingVertical: 15,
        backgroundColor: 'white'
    },
    itemLogo: {
        padding: 10
    },
    itemImage: {
        width: 70,
        height: 70
    },
    itemBody: {
        height: Dimensions.get('window').width / 18,
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    itemName: {
        fontWeight: 'bold',
        fontSize: 16
    },
    itemStatus: {
        height: Dimensions.get('window').width / 18,
        backgroundColor: 'green',
        paddingHorizontal: 3,
        justifyContent: 'flex-start',
        right: 12
    },
    itemOperation: {
        height: Dimensions.get('window').width / 18,
        backgroundColor: 'gray',
        paddingHorizontal: 3,
        justifyContent: 'flex-end',
        right: 12
    },
    itemIconBody: {
        flex: 1,
        alignSelf: 'flex-end',
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    itemLike: {
        fontWeight: 'bold',
        fontSize: 16
    },
    itemIcon: {
        width: 20,
        height: 20
    }
})