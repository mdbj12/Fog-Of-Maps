import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Homescreen from "./Homescreen";
import UserDetailsScreen from "./UserDetailsScreen";

const Tab = createBottomTabNavigator()

export default function Main({ route }){
    const user = route.params.user // retrieve user obj from route param
    const setUser = route.params.setUser
    const handleLogout = route.params.handleLogout
    // console.log(user)

    return (
        <Tab.Navigator>
            <Tab.Screen
                name='Home'
                options={{title: 'Home', headerShown:false}}
                component={Homescreen}
                initialParams={{ user, setUser }}
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