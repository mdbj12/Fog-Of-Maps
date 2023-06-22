import React, { useEffect, useState } from "react";
import { StyleSheet, View, Button, Dimensions, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';

export default function Homescreen(){
    const [userLocation, setUserLocation] = useState(null)

    useEffect(() => {
        getUserLocation()
    }, [])

    const getUserLocation = async() => {
        try {
            const {status} = await Location.requestForegroundPermissionsAsync()
            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({})
                const {latitude, longitude} = location.coords
                setUserLocation({latitude, longitude})
            }
        } catch (error) {
            console.log('Error getting User Location', error)
        }
    }

    const initialRegion = {
        latitude: userLocation?.latitude || 0,
        longitude: userLocation?.longitude || 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
            >
                {userLocation && (
                    <Marker
                        coordinate={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude
                        }}
                        title="Marker"
                        description="Marker Desc"
                    />
                )}
            </MapView>
        </View>
      );
}
    
let { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        paddingTop: 50
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    }
})