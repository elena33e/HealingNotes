// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button } from 'react-native';
//import firestore from '@react-native-firebase/firestore';
import CategoryCard from '../components/CategoryCard';
import {db} from '../firebaseConfig';
import { collection, getDocs } from "firebase/firestore";


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
            <Text>Categories</Text>
            <Button
            style= {styles.button}
              title="Add new category"
              color="#841584"
              onPress={() =>
              navigation.navigate('AddCategory')
               }
           />
        </View>
    );
};

const styles = StyleSheet.create({
 container : {
        padding: 10,
        borderRadius: 5
 },
 button :{
  padding: 10,
  width: 20,
  borderRadius : 50
 }
});

export default CategoriesScreen;
