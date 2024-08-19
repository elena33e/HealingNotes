// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, TextInput } from 'react-native';
//import { TextInput } from 'react-native-gesture-handler';



const LoginScreen = ({email, setEmail, password, setPassword,  handleAuthentication}) => {
  const [isLogin, setIsLogin] = useState(true);

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Image source={require('./../assets/login.png')}
              style={styles.image}
            />
            <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
            
            <TextInput
             style={styles.input}
             value={email}
             onChangeText={setEmail}
             placeholder='Email'
             autoCapitalize='none'
            />

            <TextInput
             style={styles.input}
             value={password}
             onChangeText={setPassword}
             placeholder='Password'
             secureTextEntry
            />

        <View style={styles.buttonContainer}>
          <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </Text>
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    //flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input : {
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 17,
    fontSize: 15,
    marginTop: 5
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150
  }
});

export default LoginScreen;
