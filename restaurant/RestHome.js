import React, { Component, useState, useEffect } from "react";
import {
    Text,
    View,
    Image,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from "react-native"
import { Box, Center, VStack, HStack, IconButton, Icon, HamburgerIcon, ScrollView, NativeBaseProvider, Input, Button, Slider, Switch } from "native-base";
import database from '@react-native-firebase/database';
import RestInfo from './ListItem.js';
import { createStackNavigator } from '@react-navigation/stack';
import SearchInput, { createFilter } from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['name', 'dong', 'category'];

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            deilver_check: '0',
            data: {}
        }
    }
    componentDidMount() {
        const ref = database().ref("/식당");
        ref.once("value").then(snapshot => {
            if (snapshot)
                this.setState({ data: snapshot.val() });
            // console.log(this.state.data)
        })
    }
    searchUpdated(term) {
        this.setState({ searchTerm: term })
    }
    render() {
        var arr = []
        Object.keys(this.state.data).forEach(key => arr.push({
            name: key,
            dong: this.state.data[key].dong,
            likes: this.state.data[key].likes,
            bookmark_count: this.state.data[key].bookmark_count,
            comments_count: this.state.data[key].comments_count,
            category: this.state.data[key].category,
            delivery_availability: this.state.data[key].delivery_availability,
        }))
        var sortJsonArray = require('sort-json-array');
        sortJsonArray(arr, 'name', 'asc');
        const filteredArr = arr.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
        return (
            <NativeBaseProvider>
                <HStack alignItems="center" space={1} m={2}>
                    <Text fontSize="md">배달가능만 보기</Text>
                    <Switch />
                </HStack>
                <SearchInput
                    onChangeText={(term) => { this.searchUpdated(term) }}
                    style={styles.searchInput}
                    placeholder="식당을 검색하세요."
                />
                <Center flex={1}>
                    <ScrollView width="100%">
                        <VStack my={0.5} space={0.5} alignItems="center">
                            {filteredArr.map((item) => (
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
                                        <Text>{item.category}</Text>
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
                                            /> {item.comments_count} </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </VStack>
                    </ScrollView>
                </Center>
            </NativeBaseProvider>
        )
    }
}

const Stack = createStackNavigator();

export default function App() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="식당 리스트" component={Home}
                options={{
                    headerLeft: () => (
                        <NativeBaseProvider>
                            <HamburgerIcon ml={3} />
                        </NativeBaseProvider>
                    ),
                }} />
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
    },
    searchInput: {
        padding: 15,
        borderColor: '#CCC',
        borderWidth: 1
    }
})