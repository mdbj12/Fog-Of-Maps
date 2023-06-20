import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Text } from "react-native";

import Homescreen from "./Homescreen";

const Tab = createBottomTabNavigator()

export default function Main({navigation, route}){
    return (
        <Tab.Navigator>
            <Tab.Screen
                name='Home'
                options={{title: 'Home', headerShown:false}}
                component={Homescreen}
                initialParams={{setUser: route.params.setUser}}
            />
        </Tab.Navigator>
    )
}