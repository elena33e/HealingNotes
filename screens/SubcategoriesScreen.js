import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from "firebase/firestore";
import CategoryCard from '../components/CategoryCard';

const SubcategoriesScreen = ({ route, navigation }) => {
  const { parent } = route.params;  // Retrieve parent ID from route params
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, [parent]);  // Fetch categories whenever parent changes

  const getCategories = async () => {
    if (!parent) {
      console.error("Parent ID is undefined");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching categories with parent ID:", parent);

      // Query to fetch categories where the 'parent' field matches the 'parent' ID
      const categoriesQuery = query(
        collection(db, 'Categories'),
        where('parent', '==', parent)  // Match the 'parent' field to 'parent'
      );

      const querySnapshot = await getDocs(categoriesQuery);
      const categoriesList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        key: doc.id,
      }));

      setCategories(categoriesList);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryName) => {
    // Navigate to SubcategoriesScreen with the selected category's ID as the new parent
    navigation.navigate('SubcategoriesScreen', { parent: categoryName });
  };

  const removeCategory = (categoryId) => {
    setCategories(categories.filter(category => category.key !== categoryId));
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CategoryCard 
            category={item.name}
            image={{ uri: item.image }} 
            itemKey={item.key}
            onPress={() => handleCategoryPress(item.name)} 
            onDelete={removeCategory}
          />
        )}
        keyExtractor={(item) => item.key}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.scrollViewContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  row: {
    justifyContent: 'space-between',  
    marginBottom: 10,
  },
  scrollViewContent: {
    padding: 20,
  },
});

export default SubcategoriesScreen;
