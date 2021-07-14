import React, {useState, useEffect} from "react";
import {Text, View, ScrollView, SafeAreaView, StyleSheet, Button} from "react-native"
import {WebView} from "react-native-webview"
import Icon from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';

const MapView = () => {
    return(
        <WebView style={style.mapView} source={{uri: "http://kko.to/LGrhG-H4M" }} originWhitelist={['*']} />
    )
}

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

    if(restData["menu"] != undefined) {
        for(var menuList of restData["menu"])
            menu += menuList + "\n";
        menu = menu.substring(0, menu.length - 1)
    }
    
    return (
        <>
            <View style = {style.partition}>
                <Text style={style.contexts}><Text style={style.keyText}>이름 :</Text> {restData["official_name"]}</Text>
                <Text style={style.contexts}><Text style={style.keyText}>주소 :</Text> {restData["address"]}</Text>
                <Text style={style.contexts}><Text style={style.keyText}>번호 :</Text> {restData["contact"]}</Text>
            </View>
            <View style = {style.partition}>
                <Text style={style.contexts}>
                    <Text style={style.keyText}>한동대까지의 거리 : </Text>
                    {(restData["distance"]==undefined?"0":restData["distance"]/1000)}km
                </Text>
                <MapView></MapView>
            </View>
            <View style = {style.partition}>
                <Text style={[style.keyText, {lineHeight : 40, fontSize : 16}]}>ᐧ 메뉴</Text>
                <Text style={({paddingLeft : 20})}>{menu}</Text>
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
            <View style = {style.commentView}>
            <Icon.Button name="facebook" backgroundColor="#3b5998">
                <Text style={{ fontFamily: 'Arial', fontSize: 15 }}>
                Login with Facebook
                </Text>
            </Icon.Button>
            </View>
        </SafeAreaView>
    )
}

export default ItemActivity;

const style = StyleSheet.create({
    containter : {
        height : "100%"
    },
    contexts : {
        lineHeight : 20
    },
    keyText : {
        fontWeight : "bold",
    },
    partition : {
        borderWidth : 2,
        borderRadius : 25,
        margin : 5,
        paddingVertical : 20,
        paddingHorizontal : 30
    },
    mapView : {
        height : "100%",
        aspectRatio : 1
    },
    commentView : {
        position : "absolute",
        bottom : 60,
        width : "100%"
    },
    commentButton : {
        
    }
})
