// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import {db} from '../firebaseConfig';
import { addDoc, collection, getDocs } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Formik } from 'formik';
import {Picker} from '@react-native-picker/picker';
import { TextInput } from "react-native-gesture-handler";
import * as ImagePicker from 'expo-image-picker';
//import {useUser} from '@clerk/clerk-expo'


const AddCategoryScreen = () => {
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]); 
    const storage = getStorage();
    //const user = useUser();

    useEffect(() => {
      getCategories();
    }, [])

    const getCategories = async() => {
      setCategories([]);
      const querySnapshot = await getDocs(collection(db, 'Categories'));
      querySnapshot.forEach((doc)=> {
        console.log('Docs' , doc.data());
        setCategories(categories => [...categories, doc.data() ]);
      })
    }

    /* Used to pick image from Gallery */

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };

    const onSubmitMethod = async(value) => {
      
      //Convert Uri to Blob file
      const resp = await fetch(image);
      const blob = await resp.blob();

      const storageRef = ref(storage, 'catImages/' + Date.now() + '.jpg');
      uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      }).then((resp) => {
        getDownloadURL(storageRef).then(async(downloadUrl) => {
          console.log(downloadUrl);
          value.image = downloadUrl;

          const docRef = await addDoc(collection(db, 'Categories'), value);
          if(docRef.id){
            console.log('Document added!');
          }
        })
      });
      
    };


    return (
        <View style={styles.container}>

            <Formik
            
            initialValues={{ name: '', parent: '', image : '' }}
            onSubmit={value => onSubmitMethod(value)}
            validate={(values) => {
              const errors = {};
              if(!values.name){
                console.log('Name not present');
                ToastAndroid.show('You must give the category a name', ToastAndroid.SHORT,  ToastAndroid.BOTTOM);
                errors.name='You must give the category a name'
              }
              return errors;
            }}
            >
              {({handleChange, handleBlur, handleSubmit, values, setFieldValue, errors}) => (
               <View >

                <TouchableOpacity 
                  onPress={pickImage}
                  style = {styles.imageContainer}
                >
                {image?
                 <Image source={{uri:image}} style={styles.image}/>
                 :
                 <Image source ={require('../assets/placeholder.png')}
                 style={styles.image}/>
                }

                </TouchableOpacity>
                 
                   <TextInput
                   style = {styles.input}
                   placeholder="Name "
                   value={values?.name}
                   onChangeText={handleChange('name')}
                   />

              
              <Picker
                selectedValue={values?.parent}
                style={styles.input}
                onValueChange={itemValue => setFieldValue('parent', itemValue)}>
                  {categories.length > 0 && categories?.map((item, index) =>(
                    <Picker.Item key={index}
                    label={item?.name} value={item?.name} />
                  ))}
              </Picker>
             


               <TouchableOpacity 
                     style={styles.button}
                     onPress={handleSubmit}>
                      <Text style={styles.add}>Add</Text>
              </TouchableOpacity>
               </View>
              )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    container : {
           width: "100%",
           padding: 30,
           borderRadius: 5,
           flex: 1, 
           justifyContent: 'center'
    },
    input : {
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        paddingHorizontal: 17,
        fontSize: 15,
        marginTop: 5
    },
    button:{
      padding: 10,
      backgroundColor: "#474F7A",
      borderRadius: 50,
      marginTop: 10
      
    },
    add: {
      textAlign: "center",
      color: 'white',
      fontSize: 15
    },
    image: {
      borderRadius: 15,
      width: 100,
      height: 100
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center'
    }
   });

export default AddCategoryScreen;
