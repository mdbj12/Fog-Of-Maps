import React, { useEffect, useState } from 'react';
import { StyleSheet} from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Main from './Main';
import Login from './Login';

const Stack = createNativeStackNavigator()

export default function App() {
  // const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('http://192.168.1.27:5556/users')
    .then(res => res.json())
    .then(data => setUser(data))
    AsyncStorage.getItem('loggedIn').then((value) => {
      if (value) {
        fetch(`http://192.168.1.27:5556/users/${value}`)
        .then(res => res.json())
        .then(data => setUser(data))
      }
    })
  }, [])

  const handleLogin = (user) => {
    setUser(user)
    AsyncStorage.setItem('loggedIn', String(user.id))
  }

  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator>
        {user != null ? (
          <Stack.Screen
            name={`Welcome ${user.username}`}
            component={Main}
            initialParams={{user, setUser}}
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

