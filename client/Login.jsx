import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, ImageBackground } from 'react-native';

export default function Login({navigation, route}){
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isForm, setIsForm] = useState(false)
  const [createUsername, setCreateUsername] = useState("")
  const [createEmail, setCreateEmail] = useState("")
  const [createPassword, setCreatePassword] = useState("")

  const signupForm = 
  <View>
    <TextInput 
      onChangeText={text => setCreateUsername(text)}
      value={createUsername}
      placeholder='Enter Username'
      style={styles.textInput}
    />
    <TextInput 
      onChangeText={text => setCreateEmail(text)}
      value={createEmail}
      placeholder='Enter Email'
      style={styles.textInput}
    />
    <TextInput 
      onChangeText={text => setCreatePassword(text)}
      value={createPassword}
      placeholder='Create Password'
      secureTextEntry
      style={styles.textInput}
    />
    {errorMessage !== "" && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    <View style={styles.buttonContainer}>
      <View style={styles.signupButton}>
        <Button 
          title='Signup!'
          onPress={handleSignup}
          color='white'
        />
      </View>
    </View>
  </View>

  function showForm(){
    setIsForm(!isForm)
  }

  function handleLogin() {
    const userObj = {username, password}

    fetch(`http://10.129.2.157:5556/login`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify(userObj),
    })
    .then(
      async (res) => {
          if (res.status === 200){
          let user = await res.json()
          route.params?.onLogin(user)
      } else {
          console.log("error logging in")
      }}
    )
    .catch(function(error) {
        console.log("error info here:" + " " + error.message)
    })
  }

  function handleSignup(){
    const newUserObj = {username: createUsername, email: createEmail, password: createPassword}
    
    fetch('http://10.129.2.157:5556/signup',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserObj),
    })
    .then(async res => {
      if (res.status === 201){
        let user = await res.json()
        route.params.onLogin(user)
      } else if(res.status === 406){
        setErrorMessage('Username already exists')
      } else if(res.status === 409){
        setErrorMessage('Email already exists')
      } else if(res.status === 422){
        setErrorMessage('Please enter a password')
      }
      })
  }

  return (
    <View>
      <ImageBackground source={require('../assets/test2.webp')} style={styles.backgorund}>
        <View style={styles.container}>
          <Text style={styles.title}>Fog Of Maps</Text>
          <TextInput 
            onChangeText={text => setUsername(text)}
            value={username}
            placeholder='Username...'
            style={styles.textInput}
          />
          <TextInput 
            onChangeText={text => setPassword(text)}
            value={password}
            placeholder='Password...'
            secureTextEntry
            style={styles.textInput}
          />
          <View style={styles.buttonContainer}>
            <View style={styles.loginButton}>
              <Button 
                title='Login'
                onPress={handleLogin}
                color='white'
              />
            </View>
            <Button 
              title='Need an account?'
              onPress={showForm}
              />
          </View>
        </View>
        {isForm ? signupForm : null}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  backgorund: {
    resizeMode: 'fill',
    width: '100%',
    height: '100%'
  },
  container: {
    paddingTop: 100
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    paddingBottom: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: {width: -3, height: 1},
    textShadowRadius: 5
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20
  },
  loginButton: {
    backgroundColor: '',
    width: 200,
    borderRadius: 20
  },
  textInput: {
    marginVertical: 10,
    marginHorizontal: 100,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    color: '',
    fontSize: 20,
    padding: 8
  },
  buttonText: {
    textAlign: 'center'
  },
  signupButton: {
    width: 200,
    borderRadius: 20
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold'
  }
})