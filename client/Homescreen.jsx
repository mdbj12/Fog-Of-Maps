import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Button, Dimensions, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, { Circle, Marker, Polygon } from "react-native-maps";
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Homescreen({route}){
    const [userLocation, setUserLocation] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [markers, setMarkers] = useState([])
    const [visited, setVisited] = useState([])
    const mapRef = useRef(null)

    const user = route.params.user
    const setUser = route.params.setUser

    console.log(user)
    useEffect(() => {
        getUserLocation()
        startLocationUpdates()
        fetchMarkers()
    }, [])

    const initialRegion = {
        latitude: userLocation?.latitude || 0,
        longitude: userLocation?.longitude || 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
    }

    // gets users current location
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

    // if you click the button on the top right, it will take you back to your current location
    const handleCurrentLocation = async () => {
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
                setVisited([...visited, { latitude, longitude }])
            }
        } catch (error) {
            console.log('Error getting User Location', error)
        } finally {
            setButtonLoading(false)
        }
    }

    // updates users location as they are moving around
    const startLocationUpdates = async () => {
        try{
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
                        setVisited([...visited, { latitude, longitude }])
                    }
                )
            }
        } catch (error) {
            console.log('Error starting location updates', error)
        }
    }

    // grabs marker data from the Marker API route
    const fetchMarkers = async () => {
        try {
            const response = await fetch(`http://10.129.2.157:5556/users/${user.id}/markers`)
            if (!response.ok) {
                throw new Error('Failed to fetch markers')
            }
            const markers = await response.json()
            setMarkers(markers)
        } catch (error) {
            console.log('Error fetching markers', error)
        } finally {
            setIsLoading(false)
        }
    }

    // renders markers that user has posted to the database
    const renderMarkers = () => {
        return markers.map((marker) => (
            <Marker
                key={marker.id}
                coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude
                }}
                pinColor="red"
                title="Visited!"
                description={`Youve been here ${marker.times_visited} times!`}
            />
        ))
    }

    // screen overlay, if something is loading, display this screen
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
            >
                {renderMarkers()}
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
        left: 25,
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