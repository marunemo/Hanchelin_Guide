import React, { Component } from "react";
import {
    StyleSheet,
    Switch,
    TouchableOpacity,
} from "react-native"
import {
    Text,
    Image,
    Center,
    VStack,
    HStack,
    ScrollView,
    NativeBaseProvider,
    Select,
    CheckIcon,
} from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchInput, { createFilter } from 'react-native-search-filter';
import RestInfo from './info/ListItem';
import Profile from "../jin/screens/Profile.js";

const KEYS_TO_FILTERS = ['name', 'dong', 'category'];

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            switchValue: false,
            category: '',
            sortTerm: '가나다순',
            data: []
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
    setCategory(cate) {
        cate == "전체" ? this.setState({ category: '' }) : this.setState({ category: cate })
    }
    setSortTerm(term) {
        this.setState({ sortTerm: term })
        term == "가나다순" && this.setState({ data: this.state.data.sort((a, b) => a.name > b.name) })
        term == "추천순" && this.setState({ data: this.state.data.sort((a, b) => a.likes < b.likes) })
        term == "리뷰개수순" && this.setState({ data: this.state.data.sort((a, b) => a.comments_count < b.comments_count) })
    }
    render() {
        const filteredArr = (this.state.data)
            .filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
            .filter(createFilter(this.state.switchValue ? '1' : '', 'delivery_availability'))
            .filter(createFilter(this.state.category, 'category'))
        return (
            <NativeBaseProvider>
                <Select
                    selectedValue={this.state.sortTerm}
                    placeholder="정렬"
                    onValueChange={(itemValue) => this.setSortTerm(itemValue)}
                    _selectedItem={{
                        bg: "#468966",
                        endIcon: <CheckIcon size={4} />,
                    }}
                    m={2}
                >
                    <Select.Item label="가나다순" value="가나다순" />
                    <Select.Item label="추천순" value="추천순" />
                    <Select.Item label="리뷰개수순" value="리뷰개수순" />
                    <Select.Item label="별점순" value="별점순" />
                </Select>
                <HStack alignItems="center" space={1} mx={2} mb={2}>
                    <Select
                        selectedValue={this.state.category}
                        width="55%"
                        placeholder="카테고리를 선택하세요"
                        onValueChange={(itemValue) => this.setCategory(itemValue)}
                        _selectedItem={{
                            bg: "#468966",
                            endIcon: <CheckIcon size={4} />,
                        }}
                        mr={1}
                    >
                        <Select.Item label="전체" value="전체" />
                        <Select.Item label="한식" value="한식" />
                        <Select.Item label="양식" value="양식" />
                        <Select.Item label="돈까스 / 회 / 일식" value="돈까스 / 회 / 일식" />
                        <Select.Item label="중식" value="중식" />
                        <Select.Item label="치킨" value="치킨" />
                        <Select.Item label="육류 / 고기" value="육류 / 고기" />
                        <Select.Item label="족발 / 보쌈" value="족발 / 보쌈" />
                        <Select.Item label="분식" value="분식" />
                        <Select.Item label="술집" value="술집" />
                        <Select.Item label="아시안" value="아시안" />
                        <Select.Item label="카페 / 디저트" value="카페 / 디저트" />
                    </Select>
                    <Text>배달가능만 보기</Text>
                    <Switch
                        value={this.state.switchValue}
                        onValueChange={(switchValue) => this.setState({ switchValue })} />
                </HStack>
                <SearchInput
                    onChangeText={(term) => { this.searchUpdated(term) }}
                    style={styles.searchInput}
                    placeholder="식당을 검색하세요."
                />
                <Center flex={1}>
                    <ScrollView width="100%">
                        <VStack mb={0.5} space={0.5} alignItems="center">
                            {filteredArr.map((item) => (
                                <TouchableOpacity
                                    style={styles.itemContainer}
                                    onPress={() => this.props.navigation.navigate('식당 정보', { restId: item.id })}>
                                    <HStack>
                                        <Image style={{ flex: 3 }}
                                            resizeMode={"contain"}
                                            source={require('../images/none.jpeg')}
                                            alt="Alternate Text"
                                            size={"md"}
                                        />
                                        <VStack space={1} style={{ flex: 5 }}>
                                            <Text bold>{item.name}</Text>
                                            <Text>{item.category}</Text>
                                            <Text>{item.dong}</Text>
                                        </VStack>
                                        <HStack style={{ flex: 4 }} space={1}>
                                            <Icon name="thumbs-up" size={24} color="#30A9DE" />
                                            <Text>{item.likes}</Text>
                                            <Icon name="heart" size={24} color="#f15c5c" />
                                            <Text>{item.bookmark_count}</Text>
                                            <Icon name="comments" size={24} color="#8b8687" />
                                            <Text>{item.comments_count}</Text>
                                        </HStack>
                                    </HStack>
                                </TouchableOpacity>
                            ))}
                        </VStack>
                    </ScrollView>
                </Center>
            </NativeBaseProvider>
        )
    }
}

const Stack = createNativeStackNavigator();

export default function App({ navigation }) {
    return (
        <NativeBaseProvider>
            <Stack.Navigator>
                <Stack.Screen name="식당 리스트" component={Home}
                    options={{
                        headerStyle: {
                            backgroundColor: '#468966',
                        },
                        headerTintColor: '#ffffff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20,
                        },
                        headerLeft: () => (
                            <Icon name="bars" size={24} color="#ffffff"
                                onPress={() => navigation.navigate('프로필')} />
                        )
                    }} />
                <Stack.Screen name="식당 정보" component={RestInfo}
                    options={{
                        headerStyle: {
                            backgroundColor: '#468966',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20,
                        }
                    }} />
                <Stack.Screen name="프로필" component={Profile} />
            </Stack.Navigator>
        </NativeBaseProvider>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        justifyContent: 'center',
        width: "100%",
        height: 110,
        backgroundColor: 'white'
    },
    searchInput: {
        padding: 15,
        borderColor: '#DDD',
        borderWidth: 1
    }
})