// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, FlatList, ActivityIndicator, StyleSheet, Button } from 'react-native';
//import firestore from '@react-native-firebase/firestore';
import CategoryCard from '../components/CategoryCard';
import {db} from '../firebaseConfig';
import { collection, getDocs } from "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/MaterialIcons';

const CategoriesScreen = ({navigation}) => {
    const [loading, setLoading] = useState(true); 
    const [categories, setCategories] = useState([]); 
    

    useEffect(() => {
      getCategories();
    }, [])

    const getCategories = async() => {
      const querySnapshot = await getDocs(collection(db, 'Categories'));
      querySnapshot.forEach((doc)=> {
        console.log('Docs' , doc.data());
        setCategories(categories => [...categories, doc.data() ]);
      })
    }
    /*useEffect(() => {
        const subscriber = firestore()
          .collection('Categories')
          .onSnapshot(querySnapshot => {
            const categories = [];
      
            querySnapshot.forEach(documentSnapshot => {
              categories.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            });
      
            setCategories(categories);
            setLoading(false);
          });
      
        // Unsubscribe from events when no longer in use
        return () => subscriber();
      }, []);

    console.log(categories);*/
    
   
    
  /*if (loading) {
    return <ActivityIndicator />;
  }*/

    return (
      <View style={styles.container}>
            
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.textContent}>My Categories</Text>
        
       </ScrollView>
        <View style={styles.buttonContainer}>
        <TouchableOpacity
          style= {styles.button}
          onPress={() =>
          navigation.navigate('AddCategory')
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

export default CategoriesScreen;
