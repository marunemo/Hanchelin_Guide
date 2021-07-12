import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import firebase from '@react-native-firebase/database';

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = { data: {} }
    }

    componentDidMount() {
        const ref = firebase().ref("/식당/호식이두마리치킨");

        ref.once("value").then(snapshot => {
            if(snapshot)
                this.setState({ data: snapshot.val() });
            console.log(this.state.data)
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{this.state.data["official_name"]}</Text>
                <Text style={styles.text}>{this.state.data["address"]}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    text: {
        fontSize: 20,
        marginBottom: 20
    }
});