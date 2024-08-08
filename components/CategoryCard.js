// components/CategoryCard.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CategoryCard = ({ category, onPress, image }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const checkFavorite = async () => {
            try {
                const favorites = await AsyncStorage.getItem('favorites');
                if (favorites !== null) {
                    const favoritesArray = JSON.parse(favorites);
                    setIsFavorite(favoritesArray.includes(category[0]));
                }
            } catch (error) {
                console.error(error);
            }
        };
        checkFavorite();
    }, [category]);

    const toggleFavorite = async () => {
        try {
            let favorites = await AsyncStorage.getItem('favorites');
            if (favorites !== null) {
                favorites = JSON.parse(favorites);
                if (favorites.includes(category[0])) {
                    favorites = favorites.filter(id => id !== category[0]);
                } else {
                    favorites.push(category[0]);
                }
            } else {
                favorites = [category[0]];
            }
            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={onPress} style={styles.content}>
                <Image style={styles.image} source={image.image}></Image>
                <Text style={styles.text}>{category[1].name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFavorite} style={styles.icon}>
                <MaterialIcons
                    name={isFavorite ? 'favorite' : 'favorite-border'}
                    size={24}
                    color={isFavorite ? 'red' : 'gray'}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    content: {
        flex: 1,
    },
    text: {
        fontSize: 20,
    },
    icon: {
        padding: 5,
    },
    image:{
        borderRadius: 50
    },
});

export default CategoryCard;
