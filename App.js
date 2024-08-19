// App.js
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import CategoriesScreen from './screens/CategoriesScreen';
import FavoriteCategoriesScreen from './screens/FavoriteCategories';
import AddCategoryScreen from './screens/AddCategoryScreen';
import AddNoteScreen from './screens/AddNoteScreen';
import NotesScreen from './screens/NotesScreen';
import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import { StatusBar } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CategoriesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="My categories" component={CategoriesScreen} />
      <Stack.Screen name="AddCategory" component={AddCategoryScreen} />
    </Stack.Navigator>
  );
}


function NotesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="My Notes" component={NotesScreen} />
      <Stack.Screen name="AddNotes" component={AddNoteScreen} />
    </Stack.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Categories"
          component={CategoriesStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="category" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Notes"
          component={NotesStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="library-books" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Favorites"
          component={FavoriteCategoriesScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="favorite" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={AuthScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
