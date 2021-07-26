import React, { useState } from 'react';
import { NativeBaseProvider, Center, Box } from 'native-base';
import { createStackNavigator } from '@react-navigation/stack';
import {
    SafeAreaView,
    StyleSheet,
    Text,Modal,
    TouchableOpacity,
  } from 'react-native';
import {ModalPicker} from './Modalpicker'

const SettingsStack = createStackNavigator();



function B (){
    const [chooseData, setchooseData] = useState('Select Item...');
    const[isModalVisible, setisModalVisible] = useState(false)

    const changeModalVisibility = (bool) => {
        setisModalVisible(bool)
    }
    const setData = (option) => {
        setchooseData(option)
    }
    return(
        <SafeAreaView style={styles.selectBox}>
            <TouchableOpacity
                onPress={() => changeModalVisibility(true)}
                style={styles.TouchableOpacity}
            >
                <Text style={styles.text}>{chooseData}</Text>
            </TouchableOpacity>
            <Modal
                transparent={true}
                animationType='fade'
                visible={isModalVisible}
                nRequestClose={() => changeModalVisibility(false)}
            >
                <ModalPicker
                    changeModalVisibility= {changeModalVisibility}
                    setData= {setData}
                />
            </Modal>
        </SafeAreaView>
    )
}
        

const styles = StyleSheet.create({
    selectBox: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    text: {
        marginVertical: 20,
        fontSize: 15
    },
    TouchableOpacity: {
        backgroundColor: 'skyblue',
        alignSelf: 'stretch',
        paddingHorizontal: 20,
        marginHorizontal: 50
    }
});



export default function DiliverScreen() {
    return (
        <SettingsStack.Navigator>
        <SettingsStack.Screen
            name="같이배달"
            component={B}
            options={{ tabBarLabel: 'Settings!' }}
        />
        </SettingsStack.Navigator>
    );
} 