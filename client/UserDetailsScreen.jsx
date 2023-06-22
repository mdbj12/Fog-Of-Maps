import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserDetailsScreen({ navigation, route }) {
    // retrieve user obj from route param
    const user = route.params.user
    const onLogout = route.params.onLogout

    function handleLogout(){
        fetch('http://10.129.2.157:5556/logout', {
            method: "DELETE"
        })
        .then(() => {
            route.params.setUser(null)
            AsyncStorage.removeItem('loggedIn')
            navigation.navigate('Login')
        })
        .catch(error => {
            console.log('Error logging out', error)
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Details</Text>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.text}>{user.username}</Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.text}>{user.email}</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        marginBottom: 16,
    },
});