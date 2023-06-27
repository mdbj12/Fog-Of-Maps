import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as Location from 'expo-location';

import Homescreen from "./Homescreen";
import UserDetailsScreen from "./UserDetailsScreen";

const Tab = createBottomTabNavigator()

export default function Main({ route }){
    // retrieve user obj from route param
    const user = route.params.user
    const setUser = route.params.setUser
    const handleLogout = route.params.handleLogout
    const [userLocation, setUserLocation] = useState(null)
    console.log(user)

    useEffect(() => {
        getUserLocation()
    }, [])

    const getUserLocation = async() => {
        try{
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({})
                const { latitude, longitude } = location.coords
                setUserLocation({ latitude, longitude })
            }
        } catch (error) {
            console.log('Error getting User Location', error)
        }
    }

    return (
        <Tab.Navigator>
            <Tab.Screen
                name='Home'
                options={{title: 'Home', headerShown:false}}
                component={Homescreen}
                initialParams={{ user, setUser, userLocation }}
            />
            <Tab.Screen
                name='UserDetails'
                options={{title: 'User Details', headerShown:false}}
                component={UserDetailsScreen}
                initialParams={{user, setUser, onLogout: handleLogout}}
            />
        </Tab.Navigator>
    )
}