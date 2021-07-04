import React from "react";
import {Text, View, ScrollView, SafeAreaView, StyleSheet} from "react-native"

const itemActivity = () => {
    return(
        <SafeAreaView style = {style.containter}>
            <ScrollView>
                <View style = {style.partition}>
                    <Text>Test</Text>
                </View>
                <View style = {style.partition}>
                    <Text>Example</Text>
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
        padding : 50,
        alignItems : "center"
    }
})