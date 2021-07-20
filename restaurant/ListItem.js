import React, {useState, useEffect} from "react";
import {Text, View, ScrollView, SafeAreaView, StyleSheet, Modal} from "react-native"
import {WebView} from "react-native-webview"
import {IconButton, Icon, NativeBaseProvider, Input} from "native-base";
import Font from "react-native-vector-icons/FontAwesome5"
import database from '@react-native-firebase/database';

const MapView = () => {
    return(
        <WebView style={style.mapView} source={{uri: "http://kko.to/LGrhG-H4M" }} originWhitelist={['*']} />
    )
}

const CommentButton = () => {
    const [onInput, showInput] = useState(false);

    return (<>
                <Modal
                    animationType = "slide"
                    visible = {onInput}
                    onRequestClose = {() => {
                        showInput(false);
                    }}>
                    <SafeAreaView style = {style.commentView}>
                        <Text style = {style.commentHeader}>식당 리뷰</Text>
                        <Input
                            w = "80%"
                            h = "50%"
                            variant = "filled"
                            textAlignVertical = "top"
                            multiline = {true}
                            placeholder = "해당 식장에 대한 리뷰를 적어주세요." />
                        <IconButton
                            onPress={() => showInput(false)}
                            icon = {<Icon name = "window-close" as = {Font} size="sm" />} />
                    </SafeAreaView>
                </Modal>
                <IconButton
                    style = {style.commentButton}
                    borderRadius="full"
                    colorScheme="cyan"
                    variant="solid"
                    size = "lg"
                    onPress={() => showInput(true)}
                    icon = {<Icon name = "comment-alt" as = {Font} size="sm" />} />
            </>)
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
            <NativeBaseProvider>
                <ScrollView>
                    <RestComponent></RestComponent>
                </ScrollView>
                <CommentButton/>
            </NativeBaseProvider>
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
        borderWidth : 2,
        borderRadius : 25,
        width : "95%",
        height : "50%",
        alignItems : "center",
        alignSelf : "center",
    },
    commentButton : {
        position : "absolute",
        bottom : 30,
        right : 30,
    },
    commentHeader : {
        fontWeight : "bold",
        marginVertical : 25,
        fontSize : 20
    }
})
