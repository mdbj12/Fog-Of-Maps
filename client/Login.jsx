import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, ImageBackground, Pressable } from 'react-native';

export default function Login({route}){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isForm, setIsForm] = useState(false)
    const [createUsername, setCreateUsername] = useState("")
    const [createEmail, setCreateEmail] = useState("")
    const [createPassword, setCreatePassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const signupForm = 
    <View>
        <TextInput 
          onChangeText={text => setCreateUsername(text)}
          value={createUsername}
          placeholder='username'
        />
        <TextInput 
          onChangeText={text => setCreateEmail(text)}
          value={createEmail}
          placeholder='email'
        />
        <TextInput 
          onChangeText={text => setCreatePassword(text)}
          value={createPassword}
          placeholder='password'
        />
        {errorMessage !== "" && <Text>{errorMessage}</Text>}
        <View>
          <View>
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

    function handleSubmit() {
        fetch(`http://10.129.2.157:5556/login`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
        .then(
            async res => {
                if (res.status==200){
                let user = await res.json()
                route.params.onLogin(user)
            } else {
                console.log("error loggin in")
            }}
        )
        // .catch(function(error) {
        //     console.log("error info here:" + " " + error.message)
        // })
    }

    function handleSignup(){
      const userObj = {username: createUsername, email: createEmail, password: createPassword}
      
      fetch('http://10.129.2.157/signup',{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userObj),
      })
      .then(async res => {
        if (res.status==201){
          let user = await res.json()
          route.params.onLogin(user)
        } else if(res.status == 406){
          setErrorMessage('Username already exists')
        } else if(res.status == 409){
          setErrorMessage('Email already exists')
        } else if(res.status == 422){
          setErrorMessage('Please enter a password')
        }
        })
    }

    return (
      <View>
        <View>
        <Text>TEXT</Text>
        <TextInput 
            onChangeText={text => setUsername(text)}
            value={username}
            placeholder='username'
        />
        <TextInput 
            onChangeText={text => setPassword(text)}
            value={password}
            placeholder='password'
            secureTextEntry
        />
        <View>
            <View>
            <Button 
                title='Login'
                onPress={handleSubmit}
                color='white'
            />
            </View>
        </View>
        <Button 
            title='Need an account?'
            onPress={showForm}
        />
        </View>
        {isForm ? signupForm : null}
      </View>
    );
}
