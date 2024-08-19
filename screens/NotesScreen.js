// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import { ScrollView, Text, FlatList, ActivityIndicator, StyleSheet, Button, View } from 'react-native';
//import firestore from '@react-native-firebase/firestore';
import CategoryCard from '../components/CategoryCard';
import {db} from '../firebaseConfig';
import { collection, getDocs } from "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/MaterialIcons';

const NotesScreen = ({navigation}) => {
    const [loading, setLoading] = useState(true); 
    const [notes, setNotes] = useState([]); 
    

    useEffect(() => {
      getNotes();
    }, [])

    const getNotes = async() => {
      const querySnapshot = await getDocs(collection(db, 'Notes'));
      querySnapshot.forEach((doc)=> {
        console.log('Notes' , doc.data());
        setNotes(notes => [...notes, doc.data() ]);
      })
    }

    return (
        <View style={styles.container}>
            
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.textContent}>My Notes</Text>
            
           </ScrollView>
            <View style={styles.buttonContainer}>
            <TouchableOpacity
              style= {styles.button}
              onPress={() =>
              navigation.navigate('AddNotes')
               }
             >
                 <Icon name="add" size={24} color="white" />
            </TouchableOpacity>
           </View>
        </View>
    );
};

const styles = StyleSheet.create({
 container : {
    flex: 1
        
 },
 scrollViewContent: {
    padding: 20,
 },
 textContent: {
    fontSize: 18,
    marginBottom: 1000, // Add a large margin to demonstrate scrolling
  },
 button: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200EE',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // for Android shadow
},
buttonContainer:{
    position: 'absolute',
    bottom: 20,
    right: 20,
    //alignSelf: 'flex-end'
}
});

export default NotesScreen;
