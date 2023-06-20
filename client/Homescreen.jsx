import React, {useContext} from "react";
import { StyleSheet, Text, View, Button, Image, ImageBackground, Modal } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Loader } from "@googlemaps/js-api-loader"

export default function Homescreen({navigation, route}){
    function handleLogout(){
        fetch('http://10.129.2.157:5556/logout', {
            method: "DELETE"
        })
        .then(() => {
            route.params.setUser(null)
            AsyncStorage.removeItem('loggedIn')
        })
    }

    return(
        <View>
            <Button
                onPress={handleLogout}
                title='Logout'
            />
        </View>
    )
}
