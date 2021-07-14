import React, { Component } from 'react';
import { NativeBaseProvider, Center, Box } from 'native-base';
import firebase from '@react-native-firebase/database';

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = { data: {} }
    }

    componentDidMount() {
        const ref = firebase().ref("/식당/호식이두마리치킨");

        ref.once("value").then(snapshot => {
            if (snapshot)
                this.setState({ data: snapshot.val() });
            console.log(this.state.data)
        })
    }

    render() {
        return (
            <NativeBaseProvider>
                <Center flex={1}>
                    <Box
                        bg="primary.400"
                        p={4}
                        _text={{
                            fontSize: "md",
                            fontWeight: "bold",
                            color: "white",
                        }}
                    >
                        {this.state.data["official_name"]}
                        {this.state.data["dong"]}
                        {this.state.data["category"]}
                        {this.state.data["address"]}
                    </Box>
                </Center>
            </NativeBaseProvider>
        );
    }
}
