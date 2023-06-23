import React, { useState } from "react";
import { StyleSheet, View, Text, Button, TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserDetailsScreen({ navigation, route }) {
    // retrieve user obj from route param
    const user = route.params.user
    const onLogout = route.params.onLogout

    const [username, setUsername] = useState(route.params.user.username)
    const [email, setEmail] = useState(route.params.user.email)

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

    function handleUserChanges(){
        const updatedUserInfo = { username, email }

        fetch(`http://10.129.2.157:5556/users/${user.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(updatedUserInfo)
        })
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error('Error updating User information')
            }
        })
        .then(updatedUser => {
            route.params.setUser(updatedUser)
            alert('Updated Successfully!')
        })
        .catch(error => {
            console.log('Error updating user information', error)
        })
    }

    function handleDeleteAccount(){
        fetch(`http://10.129.2.157:5556/users/${user.id}`, {
            method: "DELETE"
        })
        .then(() => {
            route.params.setUser(null)
            AsyncStorage.removeItem('loggedIn')
            navigation.navigate('Login')
        })
        .catch(error => {
            console.log('Error deleting user account', error)
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Details</Text>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.text}>{user.username}</Text>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
            />
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.text}>{user.email}</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />
            <Button title='Save Changes' onPress={handleUserChanges}/>
            <Button title="Delete Account" onPress={handleDeleteAccount}/>
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8
    }
});