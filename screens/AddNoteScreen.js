// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import { db } from '../firebaseConfig';
import { addDoc, collection, getDocs } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import { ScrollView, TextInput } from "react-native-gesture-handler";

//import {useUser} from '@clerk/clerk-expo'


const AddNoteScreen = () => {
    const [text, setText] = useState(null);
    const [categories, setCategories] = useState(null);
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

      const onSubmitMethod = async(value) => {

            const docRef = await addDoc(collection(db, 'Notes'), value);
            if(docRef.id){
              console.log('Document added!');
              ToastAndroid.show('Note saved!', ToastAndroid.SHORT,  ToastAndroid.BOTTOM);
            }
        
      };
  

    return (
        <View style={styles.container}>
        <ScrollView  >
            <Formik
                initialValues={{ title: '', category: '', text: '' }}
                onSubmit={value => onSubmitMethod(value)}
                validate={(values) => {
                    const errors = {};
                    if (!values.title) {
                        console.log('Title not present');
                        ToastAndroid.show('You must give the note a title', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                        errors.title = 'You must give the note a title'
                    }
                    return errors;
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors }) => (
                    <View >

                        <TextInput
                            style={styles.input}
                            placeholder="Title... "
                            value={values?.title}
                            onChangeText={handleChange('title')}
                        />

                        <View>
                            <Text>Select the category</Text>
                        <Picker
                            selectedValue={values?.category}
                            style={styles.input}
                            onValueChange={itemValue => setFieldValue('category', itemValue)}>
                            {categories?.length > 0 && categories?.map((item, index) => (
                                <Picker.Item key={index}
                                    label={item?.name} value={item?.name} />
                            ))}
                        </Picker>
                        </View>

                        <TextInput
                            multiline
                            style={styles.textArea}
                            placeholder="Your notes here... "
                            value={values?.text}
                            onChangeText={handleChange('text')}
                        />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit}>
                            <Text style={styles.add}>+</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>

        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 30,
        flex: 1   
    },
    input: {
        borderWidth: 0,
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 17,
        fontSize: 15,
        marginTop: 5
    },
    textArea: {
      flex: 1,
      alignSelf: 'flex-start',
      minHeight: 50,
      maxHeight: 100
    },
    button: {
        width: 55,
        height: 55,
        padding: 10,
        backgroundColor: "#474F7A",
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20


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

export default AddNoteScreen;
