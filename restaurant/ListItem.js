import React, {useState, useEffect} from "react";
import {Text, View, ScrollView, SafeAreaView, StyleSheet} from "react-native"
import database from '@react-native-firebase/database';

const RestComponent = () => {
    const [restData, setData] = useState({});
    var menu = "";

    useEffect(() => {
        database().ref("/식당/9월애").once("value").then(data => {
            if(data) {
                setData(data.val());
            }
        });
        console.log(restData);
    }, []);
    console.log(restData);

    for(menuList in restData["menu"])
        menu += menuList + " : " + restData["menu"][menuList] + "\n";
    menu = menu.substring(0, menu.length - 1)
    
    return (
        <>
            <View style = {style.partition}>
                <Text>이름 : {restData["official_name"]}</Text>
                <Text>주소 : {restData["address"]}</Text>
                <Text>번호 : {restData["contact"]}</Text>
            </View>
            <View style = {style.partition}>
                <Text>거리 : {restData["distance"]/1000}km</Text>
            </View>
            <View style = {style.partition}>
                <Text>메뉴</Text>
                <Text style={({alignItems : "center"})}>{menu}</Text>
            </View>
        </>
    ); 
}

const ItemActivity = () => {
    return(
        <SafeAreaView style = {style.containter}>
            <ScrollView>
                <RestComponent></RestComponent>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ItemActivity;

const style = StyleSheet.create({
    containter : {
        height : "100%"
    },
    partition : {
        borderWidth : 2,
        borderRadius : 25,
        margin : 5,
        padding : 10,
        paddingHorizontal : 30
    }
})