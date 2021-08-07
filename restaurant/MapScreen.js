import React from "react";
import {StyleSheet} from "react-native"
import NaverMapView, {Marker} from "react-native-nmap";

const MapScreen = ({route}) => {
    return(
        <NaverMapView
            style = {styles.mapScreen}
            center={{...route.params.coordinate, zoom : 17}} >
                <Marker coordinate={route.params.coordinate} />
        </NaverMapView>
    )
}

export default MapScreen;

const styles = StyleSheet.create({
    mapScreen : {
        width : "100%",
        height : "100%"
    }
})