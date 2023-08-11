import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, { Circle, Marker, Polygon } from "react-native-maps";
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/FontAwesome';
import geolib from 'geolib'

export default function Homescreen({ route }){
    const [userLocation, setUserLocation] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const [buttonLoading, setButtonLoading] = useState(false)
    const [isMapCentered, setIsMapCentered] = useState(false)

    const [markers, setMarkers] = useState([])
    const [visited, setVisited] = useState([])

    const mapRef = useRef(null)
    const user = route.params.user

    // console.log(user)
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
                setIsMapCentered(true)
            }
        } catch (error) {
            console.log('Error getting User Location', error)
        } finally {
            setIsLoading(false)
            setIsMapCentered(true)
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

                if (mapRef.current){
                    mapRef.current.animateToRegion(
                        {
                            latitude,
                            longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005
                        },
                        500
                    )
                }
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

                        // check if there are no markers
                        if (markers.length === 0) {
                            // create a new marker at users current location
                            addMarker()
                        } else {
                            // check if the user is outside of the radius of all existing markers
                            const isOutsideRadius = markers.every((marker) => {
                                const markerLocation = { latitude: marker.latitude, longitude: marker.longitude }
                                const distance = geolib.getDistance(markerLocation, { latitude, longitude })
                                return distance > 100 // replace 100 with the desired radius value
                            })

                            if (isOutsideRadius) {
                                // create a new marker at users current location
                                addMarker()
                            }
                        }
                        setVisited([...visited, { latitude, longitude }])
                        checkMarkerProximity({ latitude, longitude })
                    }
                )
            }
        } catch (error) {
            console.log('Error starting location updates', error)
        }
    }

    // checks proximity to markers and increments times_visited count if within the red radius
    const checkMarkerProximity = ({ latitude, longitude }) => {
        markers.forEach((marker) => {
            const distance = geolib.getDistance(
                { latitude, longitude },
                {
                    latitude: marker.latitude,
                    longitude: marker.longitude
                }
            )
            if (distance <= 100 && !visited.some((visit) => visit === marker.id))
            incrementTimesVisited(marker.id)
        })
    }

    // increments times_visited count of a marker
    const incrementTimesVisited = async (markerID) => {
        try {
            const markerToUpdate = markers.find((marker) => marker.id === markerID)
            const updatedMarker = {
                ...markerToUpdate,
                times_visited: markerToUpdate.times_visited + 1
            }
            const response = await fetch(
                `http://10.129.2.157:5556/users/${user.id}/markers/${markerID}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify(updatedMarker)
                    }
                )

            if (response.ok) {
                // update the markers state within the updated marker recieved from the backend
                const updatedMarkers = markers.map((marker) => 
                marker.id === markerID ? updatedMarker : marker
                )
                setMarkers(updatedMarkers)
                setVisited([...visited, markerID])
            } else {
                throw new Error('Failed to update Marker')
            }
        } catch (error) {
            console.log('Error updating the Marker: ', error)
        }
    }

    // grabs marker data from the Marker API route
    const fetchMarkers = async () => {
        try {
            const response = await fetch(
                `http://10.129.2.157:5556/users/${user.id}/markers`
            )
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

    // creates a new marker based on current user location
    const addMarker = async () => {
        try {
            if (!userLocation) {
                console.log('User location not available yet')
                return
            }

            const { latitude, longitude } = userLocation
            const existingMarker = markers.find(
                (marker) =>
                    marker.latitude === latitude && marker.longitude === longitude
            )

            if (existingMarker) {
                // if an existing marker is found, send a PATCH request to increment times_visited
                incrementTimesVisited(existingMarker.id)
            } else {
                // if no existing marker is found, create a new Marker using a POST request
                const response = await fetch(
                    `http://10.129.2.157:5556/users/${user.id}/markers`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify({ latitude, longitude, times_visited: 1 })
                    }
                )

                if (response.ok) {
                    const newMarker = await response.json()

                    // update the Markers state with the new Marker received from the backend
                    setMarkers([...markers, newMarker])
                } else {
                    throw new Error('Failed to add Marker')
                }
            }
        } catch (error) {
            console.log('Error adding/updating Marker: ', error)
        }
    }

    // delete marker
    const deleteMarker = async (markerID) => {
        try {
            const response = await fetch(
                `http://10.129.2.157:5556/users/${user.id}/markers/${markerID}`, 
                {
                    method: 'DELETE'
                }
            )

            if (response.ok) {
                // remove the deleted marker from the markers state
                const updatedMarkers = markers.filter(
                    (marker) => marker.id !== markerID
                )
                setMarkers(updatedMarkers)
            } else {
                throw new Error('Failed to delete Marker')
            }
        } catch (error) {
            console.log('Error deleting Marker: ', error)
        }
    }

    // renders markers that user has posted to the database
    const renderMarkers = () => {
        return markers.map((marker) => (
            <React.Fragment key={marker.id}>
                <Marker
                    key={marker.id}
                    coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude
                    }}
                    pinColor="red"
                    title="Visited!"
                    description={`Youve been here ${marker.times_visited} times!`}
                    // onPress={() => deleteMarker(marker.id)} // calling on deleteMarker function to delete selected Marker
                />
                <Circle
                    center={{
                        latitude: marker.latitude,
                        longitude: marker.longitude
                    }}
                    radius={100} // adjust the radius as needed
                    fillColor="rgba(255, 0, 0, 0.3)"
                    strokeColor="red"
                    strokeWidth={2}
                />
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteMarker(marker.id)} // call the deleteMarker function with the marker_id
                >
                    <Icon
                        name="trash"
                        size={20}
                        color='#fff'
                    />
                </TouchableOpacity>
            </React.Fragment>
        ))
    }

    return (
        <View style={styles.container}>
            {isLoading || !isMapCentered ? (
                <ActivityIndicator size='large' color='#0000ff' />
            ) : (
                <>
                    <MapView
                        style={styles.map}
                        region={initialRegion}
                        ref={mapRef}
                    >
                        {/* display current location and users Markers */}
                        {userLocation && (
                            <>
                                <Marker
                                    coordinate={userLocation}
                                    title="You are here"
                                    pinColor="blue"
                                />
                                {visited.map((visit, index) => (
                                    <Circle
                                        key={index}
                                        center={visit}
                                        radius={20}
                                        fillColor="rgba(0, 255, 0, 1)"
                                        strokeColor="rgba(255, 0, 0, 1)"
                                        strokeWidth={2}
                                    />
                                ))}
                                {renderMarkers()}
                            </>
                        )}
                    </MapView>

                    {/* go to current location button */}
                    <TouchableOpacity
                        style={styles.locationButton}
                        onPress={handleCurrentLocation}
                        disabled={buttonLoading}
                    >
                        {buttonLoading ? (
                            <ActivityIndicator size='small' color='#fff' />
                        ) : (
                            <Icon name='location-arrow' size={20} color='#fff' />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton} onPress={addMarker} >
                        <Icon name='plus' size={20} color='#fff' />
                    </TouchableOpacity>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    locationButton: {
        position: 'absolute',
        top: 75,
        left: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 10,
        borderRadius: 20
    },
    addButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        padding: 10,
        borderRadius: 20
    },
    deleteButton: {
        position: 'absolute',
        top: 125,
        left: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 10,
        borderRadius: 20
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    }
})