import React, {useState} from "react";
import {Text, View, ScrollView, SafeAreaView, StyleSheet} from "react-native"
import database from '@react-native-firebase/database';

const itemActivity = () => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [distance, setDistance] = useState("");
    const [menu, setMenu] = useState([]);

    database().ref("/식당/9월애").once("value").then(restData => {
        data = restData.val();
        setName(data["official_name"]);
        setAddress(data["address"]);
        setPhone(data["contact"]);
        setDistance(data["distance"]);
        setMenu(data["menu"]);
    });

    return(
        <SafeAreaView style = {style.containter}>
            <ScrollView>
                <View style = {style.partition}>
                    <Text>이름 : {name}</Text>
                    <Text>주소 : {address}</Text>
                    <Text>번호 : {phone}</Text>
                </View>
                <View style = {style.partition}>
                    <Text>거리 : {distance/1000}km</Text>
                </View>
                <View style = {style.partition}>
                    <Text>{menu}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default itemActivity;

const style = StyleSheet.create({
    containter : {
        height : "100%"
    },
    partition : {
        borderWidth : 2,
        borderRadius : 25,
        margin : 5,
        padding : 10,
        alignItems : "center"
    }
})