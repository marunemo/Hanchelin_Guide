import React from "react";
import {Text, View, ScrollView, StyleSheet} from "react-native"

const itemActivity = () => {
    return(
        <View style = {({top : 50})}>
            <View style = {style.partition}>
                <Text>Test</Text>
            </View>
            <View style = {style.partition}>
                <Text>Example</Text>
            </View>
        </View>
    )
}

export default itemActivity;

const style = StyleSheet.create({
    partition : {
        borderWidth : 2,
        borderRadius : 25,
        margin : 5,
        padding : 50,
        alignItems : "center"
    }
})