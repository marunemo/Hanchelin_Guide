import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import {
  Box,
  Image,
  Center,
  VStack,
  HStack,
  FlatList,
  NativeBaseProvider,
  Select,
  CheckIcon,
} from "native-base";
import HeaderClassicSearchBar from "../lib/src/HeaderClassicSearchBar/HeaderClassicSearchBar";
import database from '@react-native-firebase/database';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createFilter } from 'react-native-search-filter';
import RestInfo from './info/ListItem';
import AppInfo from "./AppInfo";
import Profile from "../jin/screens/Profile.js";
import RestImg from "./RestImg.js"

const KEYS_TO_FILTERS = ['name'];
//const [headerColor, iconActiveColor, iconInActiveColor] = ["#BF2A52", "#00FF00", "#f5f5f5"];
const [headerColor, iconActiveColor, iconInActiveColor] = ["#efefef", "#BF2A52", "#bbb"];

class RestaurantItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const item = this.props.restItem;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => this.props.navigation.navigate('식당 정보', { title: item.name, restId: item.id })}
      >
        <HStack px={3} py={2}>
          <RestImg item={this.props.restItem} />
          <VStack style={{ flex: 10 }}>
            <HStack px={3} style={{marginTop: 10, justifyContent: 'space-between'}}>
              <Text style={{ fontFamily: 'ELANDChoiceB', color: '#111' }}>{item.name}</Text>
              <Image
                  resizeMode="contain"
                  source={require('../images/home-icon/heart-o.png')}
                  alt="Alternate Text"
                  size="17px"
                  style={{ tintColor: "#D90404" }}
                />
            </HStack>
            <VStack space={1} style={{ flex: 5 }} pt={2.5} pl={3}>
              <Text style={{ color: '#333' }}>{item.category}</Text>
              <Text style={{ color: '#333' }}>{item.dong}</Text>
            </VStack>
            <HStack
              space={2}
              style={{ flex: 5, alignItems: 'flex-end', justifyContent: 'flex-end' }}
            >
              <HStack space={1}>
                <Image
                  resizeMode="contain"
                  source={require('../images/home-icon/star-o.png')}
                  alt="Alternate Text"
                  size="16px"
                  style={{ tintColor: "#F2CB05" }}
                />
                <Text style={{ color: '#444', fontSize: 14 }}>{item.total.toFixed(1)}</Text>
              </HStack>
              <HStack space={1}>
                <Image
                  resizeMode="contain"
                  source={require('../images/home-icon/heart-o.png')}
                  alt="Alternate Text"
                  size="15.5px"
                  style={{ tintColor: "#D90404" }}
                />
                <Text style={{ color: '#444', fontSize: 14 }}>{item.bookmark_count}</Text>
              </HStack>
              <HStack space={1}>
                <Image
                  resizeMode="contain"
                  source={require('../images/home-icon/comments-o.png')}
                  alt="Alternate Text"
                  size="16px"
                  style={{ tintColor: "rgb(73, 163, 173)" }}
                />
                <Text style={{ color: '#444', fontSize: 14 }}>{item.comments_count}</Text>
              </HStack>
            </HStack>
          </VStack>
        </HStack>
      </TouchableOpacity>
    )
  }
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      switchValue: false,
      category: '',
      sortTerm: '',
      data: [],
      changeListener: null
    }
  }
  componentDidMount() {
    const ref = database().ref("/식당");
    const onChildChange = ref.on("value", snapshot => {
      if (snapshot)
        this.setState({ data: snapshot.val() });
    });
    this.setState({ changeListener: onChildChange });
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
    term == "별점순" && this.setState({ data: this.state.data.sort((a, b) => a.total < b.total) })
    term == "리뷰많은순" && this.setState({ data: this.state.data.sort((a, b) => a.comments_count < b.comments_count) })
  }
  componentWillUnmount() {
    database().ref("/식당").off('value', this.state.changeListener);
  }
  render() {
    const filteredArr = (this.state.data)
      .filter(createFilter(this.state.category, 'category'))
      .filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
      .filter(createFilter(this.state.switchValue ? 'true' : '', 'delivery_availability'))
    return (
      <NativeBaseProvider>
        <Box backgroundColor={headerColor}>
          <HStack
            style={{ justifyContent: 'space-between' }}
            px={4}
            pt={3}
          >
            <Select
              width="60%"
              color="#555"
              style={{ fontSize: 14 }}
              py={2}
              placeholderTextColor="#555"
              variant="filled"
              selectedValue={this.state.category}
              placeholder="카테고리를 선택하세요"
              onValueChange={(itemValue) => this.setCategory(itemValue)}
              _selectedItem={{
                bg: "#BF2A52",
                endIcon: <CheckIcon size={4} />,
              }}
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
            <Select
              width="37%"
              color="#555"
              py={2}
              style={{ fontSize: 14 }}
              placeholderTextColor="#555"
              variant="filled"
              selectedValue={this.state.sortTerm}
              placeholder="정렬"
              onValueChange={(itemValue) => this.setSortTerm(itemValue)}
              _selectedItem={{
                bg: "#BF2A52",
                endIcon: <CheckIcon size={4} />,
              }}
            >
              <Select.Item label="가나다순" value="가나다순" />
              <Select.Item label="추천순" value="추천순" />
              <Select.Item label="별점순" value="별점순" />
              <Select.Item label="리뷰많은순" value="리뷰많은순" />
            </Select>
          </HStack>
        </Box>
        <Box backgroundColor="#fff">
          <HeaderClassicSearchBar
            backgroundColor={headerColor}
            iconActiveColor={iconActiveColor}
            iconInactiveColor={iconInActiveColor}
            switchValue={this.state.switchValue}
            iconBool={true}
            onChangeText={(term) => { this.searchUpdated(term) }}
            onPress={() => this.setState({ switchValue: !(this.state.switchValue) })}
          />
        </Box>
        <Center flex={1} backgroundColor='#fff'>
          <FlatList width="100%" mb={-0.5}
            data={filteredArr}
            renderItem={({ item }) => (
              <RestaurantItem
                key={item.id.toString()}
                restItem={item}
                navigation={this.props.navigation}
              />
            )}
            keyExtractor={(item) => item.id}
          />
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
        <Stack.Screen
          name="식당 리스트"
          component={Home}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>한슐랭 가이드</Text>
            ),
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableHighlight
                activeOpacity={0.4}
                underlayColor="#BF2A52"
                onPress={() => navigation.navigate("프로필")}>
                <Image
                  resizeMode="contain"
                  source={require('../images/home-icon/user.png')}
                  alt="Alternate Text"
                  size="26px"
                  style={{ tintColor: "#fff" }}
                />
              </TouchableHighlight>
            ),
            headerRight: () => (
              <TouchableHighlight
                activeOpacity={0.4}
                underlayColor="#BF2A52"
                onPress={() => navigation.navigate("앱정보")}>
                <Image
                  resizeMode="contain"
                  source={require('../images/home-icon/more.png')}
                  alt="Alternate Text"
                  size="30px"
                  style={{ tintColor: "#fff" }}
                />
              </TouchableHighlight>
            )
          }}
        />
        <Stack.Screen
          name="식당 정보"
          component={RestInfo}
          options={{
            headerShown: false,
            animation: 'none'
          }}
        />
        <Stack.Screen
          name="앱정보"
          component={AppInfo}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>더보기</Text>
            ),
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="프로필"
          component={Profile}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>프로필</Text>
            ),
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            animation: 'slide_from_left'
          }}
        />
      </Stack.Navigator>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#ededed',
    borderBottomWidth: 0.5,
    borderRadius: 15
  },
  headerTitle: {
    fontSize: 20,
    color: '#f5f5f5',
    fontFamily: 'ELANDChoiceB'
  }
})