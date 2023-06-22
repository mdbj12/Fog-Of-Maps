import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Button, Dimensions, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, { Circle } from "react-native-maps";
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Homescreen(){
    const [userLocation, setUserLocation] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [buttonLoading, setButtonLoading] = useState(false)
    const mapRef = useRef(null)

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
                // set loading status to false once location is obtained
                setIsLoading(false)
            }
        } catch (error) {
            console.log('Error getting User Location', error)
            // set loading status to false in case of an error
            setIsLoading(false)
        }
    }

    const handleCurrentLocation = async() => {
        try {
            setButtonLoading(true)
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({})
                const { latitude, longitude } = location.coords
                setUserLocation({ latitude, longitude })
                mapRef.current.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005
                }, 500)
            }
        } catch (error) {
            console.log('Error getting User Location', error)
        } finally {
            setButtonLoading(false)
        }
    }
    
    const initialRegion = {
        latitude: userLocation?.latitude || 0,
        longitude: userLocation?.longitude || 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
    }

    const handleRegionChange = (region) => {
        setUserLocation(region)
    }

    const startLocationUpdates = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status === 'granted') {
            Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 1000
                },
                (location) => {
                    const { latitude, longitude } = location.coords
                    setUserLocation({ latitude, longitude })
                }
            )
        }
    }

    useEffect(() => {
        startLocationUpdates()
    }, [])

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='blue' />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                region={initialRegion}
                onRegionChange={handleRegionChange}
            >
                {userLocation && (
                    <Circle
                        center={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude
                        }}
                        radius={25}
                        fillColor="rgba(0, 122, 255, 0.6)"
                        strokeColor="black"
                        strokeWidth={4}
                    />
                )}
            </MapView>
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={handleCurrentLocation}
                // disable the button when loading
                disabled={buttonLoading}
            >
                {buttonLoading ? (
                    <ActivityIndicator size='small' color='#fff' />
                ) : (
                    <Icon name='location-arrow' size={25} color='#fff' />
                )}
            </TouchableOpacity>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
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
    buttonContainer: {
        position: 'absolute',
        top: 75,
        right: 25,
        backgroundColor: 'blue',
        borderRadius: 20,
        padding: 10
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})