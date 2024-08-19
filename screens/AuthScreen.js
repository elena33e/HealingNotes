// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert} from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import LoginScreen from './LoginScreen';
import ProfileScreen from './ProfileScreen';
import {app} from '../firebaseConfig'

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
  const [isLogin, setIsLogin] = useState(true);

  const auth = getAuth(app);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const signUp = () => {
    auth().createUserWithEmailAndPassword('irina@gmail.com', 'irina33')
          .then(() => {
            Alert.alert('User created!')
          })
          .catch((err) => {
            console.log(err);
          })
  }

  
  const handleAuthentication = async () => {
    try {
      if (user) {
        console.log('User logged out successfully!');
        await signOut(auth);
      } else {
        //email = email.trim();
        // Validate email and password
        if (!email.includes('@')) {
          console.error('Invalid email format');
          return;
        }
        if (password.length < 6) {
          console.error('Password should be at least 6 characters');
          return;
        }

        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
        } 
        if (!isLogin){
          signUp();
          
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        // Show user's email if user is authenticated
        <ProfileScreen user={user} handleAuthentication={handleAuthentication} />
      ) : (
        // Show sign-in or sign-up form if user is not authenticated
        <LoginScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          handleAuthentication={handleAuthentication}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f0f0f0',
      }
  });

export default AuthScreen;
