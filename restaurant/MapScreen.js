import React, {useState, useEffect} from "react";
import {StyleSheet, Platform} from "react-native"
import NaverMapView, {Marker} from "react-native-nmap";
import Geolocation from 'react-native-geolocation-service';
import {useNavigation} from "@react-navigation/native";

const MapScreen = ({route}) => {
    const navigation = useNavigation();
    const [currentPosition, setPosition] = useState({latitude : 36.103116, longitude : 129.388368});
    const [centerPosition, setCenter] = useState(route.params.coordinate)

    useEffect(() => {
        if(Platform.OS === "ios")
            Geolocation.requestAuthorization("always");

        Geolocation.getCurrentPosition(
            coordinate => {
                const {latitude, longitude} = coordinate.coords;
                setPosition({latitude, longitude})
                setCenter(
                    {latitude : (currentPosition.latitude + route.params.coordinate.latitude) / 2,
                     longitude : (currentPosition.longitude + route.params.coordinate.longitude) / 2}
                )
            },
            error => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        )
    }, []);

    return(
        <NaverMapView
            style = {styles.mapScreen}
            center={{...centerPosition, zoom : 13}}
            onMapClick = {() => navigation.goBack()} >
                <Marker
                    coordinate = {currentPosition}
                    pinColor = "blue" 
                    caption = {{text : "현위치"}} />
                <Marker
                    coordinate = {route.params.coordinate}
                    caption = {{text : "목적지"}} />
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