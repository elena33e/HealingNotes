import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import { db } from '../firebaseConfig';
import { addDoc, collection, getDocs } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from "react-native-gesture-handler";
import MyButton from '../components/MyButton';
import * as ImagePicker from 'expo-image-picker';

const AddCategoryScreen = () => {
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const storage = getStorage();

    useEffect(() => {
        getCategories();
    }, [])

    const getCategories = async () => {
        setCategories([]);
        const querySnapshot = await getDocs(collection(db, 'Categories'));
        querySnapshot.forEach((doc) => {
            setCategories(categories => [...categories, doc.data()]);
        })
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const onSubmitMethod = async (value) => {
        if (!image) {
            ToastAndroid.show('Please select an image', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
            return;
        }
    
        try {
            console.log('Fetching image from URI:', image);
            const resp = await fetch(image);
            const blob = await resp.blob();
            
            console.log('Uploading image to Firebase Storage...');
            const storageRef = ref(storage, 'catImages/' + Date.now() + '.jpg');
            await uploadBytes(storageRef, blob);
    
            const downloadUrl = await getDownloadURL(storageRef);
            value.image = downloadUrl;
    
            console.log('Adding document to Firestore...');
            const docRef = await addDoc(collection(db, 'Categories'), value);
            if (docRef.id) {
                console.log('Category added with ID: ', docRef.id);
                ToastAndroid.show('Category added successfully', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
            }
        } catch (error) {
            console.error("Error adding category: ", error);
            ToastAndroid.show('Error adding category: ' + error.message, ToastAndroid.LONG, ToastAndroid.BOTTOM);
        }
    };
    
    return (
        <View style={styles.container}>
            <Formik
                initialValues={{ name: '', parent: '', image: '' }}
                onSubmit={value => onSubmitMethod(value)}
                validate={(values) => {
                    const errors = {};
                    if (!values.name) {
                        ToastAndroid.show('You must give the category a name', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                        errors.name = 'You must give the category a name';
                    }
                    return errors;
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors }) => (
                    <View>

                        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.image} />
                            ) : (
                                <Image source={require('../assets/placeholder.png')} style={styles.image} />
                            )}
                        </TouchableOpacity>

                        <TextInput
                            style={styles.input}
                            placeholder="Category title"
                            value={values?.name}
                            onChangeText={handleChange('name')}
                        />

                        <Text style={styles.label}>Choose parent category</Text>

                        <Picker
                            selectedValue={values?.parent}
                            style={styles.input}
                            onValueChange={itemValue => setFieldValue('parent', itemValue)}
                        >
                            {categories.length > 0 && categories?.map((item, index) => (
                                <Picker.Item key={index} label={item?.name} value={item?.name} />
                            ))}
                        </Picker>

                        <MyButton title='Add category' onPress={handleSubmit} style={styles.button} />
                    </View>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 30,
        borderRadius: 5,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: "white"
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#D6BBFC',
        backgroundColor: '#E8DFFC',
        borderRadius: 25,
        padding: 15,
        paddingHorizontal: 20,
        fontSize: 16,
        //color: '#6A30DA',
        marginBottom: 20,
        marginTop: 20
      },
    label: {
        marginTop: 20,
        fontSize: 16,
        color: 'black',
    },
    button: {
        padding: 15,
        backgroundColor: '#474F7A',
        borderRadius: 25,
        marginTop: 30,
    },
    add: {
        textAlign: "center",
        color: 'white',
        fontSize: 16,
    },
    image: {
        borderRadius: 20,
        width: 150,
        height: 150,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
});

export default AddCategoryScreen;

