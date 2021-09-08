import React, { Component } from "react";
import {
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import {
  Box,
  Image,
  Center,
  VStack,
  HStack,
  ScrollView,
  NativeBaseProvider,
  Select,
  CheckIcon,
} from "native-base";
import Text from '../defaultSetting/FontText';
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderClassicSearchBar from "../lib/src/HeaderClassicSearchBar/HeaderClassicSearchBar";
import database from '@react-native-firebase/database';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createFilter } from 'react-native-search-filter';
import RestInfo from './info/ListItem';
import Profile from "../jin/screens/Profile.js";

const KEYS_TO_FILTERS = ['name', 'dong', 'category'];

class RestaurantItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const item = this.props.restItem;

    if (item.category == "한식")
      img_source = require('../images/food/1.png')
    else if (item.category == "양식")
      img_source = require('../images/food/2.png')
    else if (item.category == "돈까스 / 회 / 일식")
      img_source = require('../images/food/3.png')
    else if (item.category == "중식")
      img_source = require('../images/food/4.png')
    else if (item.category == "치킨")
      img_source = require('../images/food/5.png')
    else if (item.category == "육류 / 고기")
      img_source = require('../images/food/6.png')
    else if (item.category == "족발 / 보쌈")
      img_source = require('../images/food/7.png')
    else if (item.category == "분식")
      img_source = require('../images/food/8.png')
    else if (item.category == "술집")
      img_source = require('../images/food/9.png')
    else if (item.category == "아시안")
      img_source = require('../images/food/10.png')
    else if (item.category == "카페 / 디저트")
      img_source = require('../images/food/11.png')
    else
      img_source = require('../images/none.jpeg')

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => this.props.navigation.navigate('식당 정보', { title: item.name, restId: item.id })}
      >
        <HStack>
          <Image
            style={{ flex: 3 }}
            resizeMode="contain"
            source={img_source}
            alt="Alternate Text"
            size="md"
          />
          <VStack space={1} style={{ flex: 5 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{item.category}</Text>
            <Text>{item.dong}</Text>
          </VStack>
          <HStack style={{ flex: 4, alignItems: 'flex-end' }} space={1}>
            <Icon name="thumbs-up" size={24} color="#30A9DE" />
            <Text>{item.likes}</Text>
            <Icon name="heart" size={24} color="#f15c5c" />
            <Text>{item.bookmark_count}</Text>
            <Icon name="comments" size={24} color="#8b8687" />
            <Text>{item.comments_count}</Text>
          </HStack>
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
      sortTerm: '가나다순',
      barVisible: false,
      data: [],
      changeListener: null
    }
  }
  componentDidMount() {
    const ref = database().ref("/식당");
    const onChildChange = ref.on("value", snapshot => {
      if (snapshot)
        this.setState({ data: snapshot.val() });
      // console.log(this.state.data)
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
    term == "리뷰많은순" && this.setState({ data: this.state.data.sort((a, b) => a.comments_count < b.comments_count) })
  }
  componentWillUnmount() {
    database().ref("/식당").off('value', this.state.changeListener);
  }
  render() {
    const filteredArr = (this.state.data)
      .filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
      .filter(createFilter(this.state.switchValue ? 'true' : '', 'delivery_availability'))
      .filter(createFilter(this.state.category, 'category'))
    return (
      <NativeBaseProvider>
        <Box backgroundColor='#fff'>
          <HeaderClassicSearchBar
            backgroundColor='#BF2A52'
            onChangeText={(term) => { this.searchUpdated(term) }}
            onPress={() => this.setState({ barVisible: !(this.state.barVisible) })}
          />
        </Box>
        <Center flex={1} backgroundColor='#fff'>
          <ScrollView width="100%" mb={-0.5}>
            <VStack alignItems="center">
              {filteredArr.map(item =>
                <RestaurantItem
                  key={item.id.toString()}
                  restItem={item}
                  navigation={this.props.navigation}
                />
              )}
            </VStack>
          </ScrollView>
          {this.state.barVisible && <Box
            backgroundColor="#efefef"
            width="100%"
            style={{
              borderTopEndRadius: 15,
              borderTopStartRadius: 15
            }}
          >
            <VStack
              alignItems="flex-end"
              space={2}
              p={2}
            >
              <Select
                width="100%"
                color="#222"
                placeholderTextColor="#222"
                variant="underlined"
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
                <Select.Item label="리뷰많은순" value="리뷰많은순" />
                <Select.Item label="별점순" value="별점순" />
              </Select>
              <Select
                width="100%"
                color="#222"
                placeholderTextColor="#222"
                variant="underlined"
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
              <HStack alignItems="center" space={1}>
                <Text>배달가능만 보기</Text>
                <Switch
                  value={this.state.switchValue}
                  onValueChange={(switchValue) => this.setState({ switchValue })} />
              </HStack>
            </VStack>
          </Box>}
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
            title: '한슐랭 가이드',
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#f5f5f5',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'ELANDchoiceB',
              fontSize: 20,
            },
            headerRight: () => (
              <Icon
                name="user"
                size={24}
                color="#f5f5f5"
                onPress={() => navigation.navigate("프로필")}
              />
            )
          }}
        />
        <Stack.Screen
          name="식당 정보"
          component={RestInfo}
          options={({ route }) => ({
            title: route.params.title,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#f5f5f5',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'ELANDchoiceB',
              fontSize: 20,
            },
            animation: 'fade_from_bottom'
          })}
        />
        <Stack.Screen
          name="프로필"
          component={Profile}
          options={{
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#f5f5f5',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'ELANDchoiceB',
              fontSize: 20,
            },
            animation: 'slide_from_right'
          }}
        />
      </Stack.Navigator>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: 'center',
    width: '100%',
    height: 110,
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 0.5,
    borderRadius: 15
  }
})