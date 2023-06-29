import React, { useEffect, useState } from 'react';
import { StyleSheet} from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Main from './Main';
import Login from './Login';

const Stack = createNativeStackNavigator()

export default function App() {
  const [user, setUser] = useState(null)
  // console.log()

  useEffect(() => {
    checkLoggedInStatus()
  }, [])

  const checkLoggedInStatus = async() => {
    const loggedInUser = await AsyncStorage.getItem('loggedIn')
    if (loggedInUser) {
      // User is logged in
      fetch(`http://10.129.2.157:5556/users/${loggedInUser}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data)
        })
        .catch((error) => {
          console.log('Error fetching user data', error)
        })
    } else {
      // User is NOT logged in
      setUser(null)
    }
  }

  const handleLogin = (user) => {
    // console.log("logging in")
    setUser(user)
    AsyncStorage.setItem('loggedIn', String(user.id))
  }

  const handleLogout = () => {
    setUser(null)
    AsyncStorage.removeItem('loggedIn')
  }

  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user != null ? (
          <Stack.Screen
            name={`Main`}
            component={Main}
            initialParams={{user, setUser, handleLogout}}
          />
        ) : (
          <Stack.Screen
            name='Login'
            component={Login}
            initialParams={{onLogin: handleLogin}}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

