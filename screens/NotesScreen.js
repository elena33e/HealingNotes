// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import { FlatList, ActivityIndicator, StyleSheet, View } from 'react-native';
//import firestore from '@react-native-firebase/firestore';
import NoteCard from '../components/NoteCard';
import {db} from '../firebaseConfig';
import { collection, onSnapshot } from "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/MaterialIcons';

const NotesScreen = ({navigation}) => {
    const [loading, setLoading] = useState(true); 
    const [notes, setNotes] = useState([]); 
    

    useEffect(() => {
      const notesRef = collection(db, 'Notes');

      // Set up the real-time listener for notes collection
      const unsubscribe = onSnapshot(notesRef, (querySnapshot) => {
          const notesList = [];
          querySnapshot.forEach((doc) => {
              notesList.push({
                  ...doc.data(),
                  key: doc.id,
              });
          });

          setNotes(notesList);
          setLoading(false);
      }, (error) => {
          console.error("Error fetching notes: ", error);
          setLoading(false);
      });

      // Cleanup listener on unmount
      return () => unsubscribe();
  }, []);


    // Inside NoteListScreen component
  const handleNotePress = (itemKey) => {
  const note = notes.find(n => n.key === itemKey);  // Assuming you have a 'notes' array
  navigation.navigate('NoteDetailsScreen', { note });
};


    const removeNote = (noteId) => {
      setNotes(notes.filter(note => note.key !== noteId));
    };

  if (loading) {
    return <ActivityIndicator />;
  }

    return (
      <View style={styles.container}>
      <FlatList
        data={notes}
        renderItem={({ item }) => (
          <NoteCard 
            title={item.title}   
            text={item.text}
            itemKey={item.key}
            onPress={handleNotePress} 
            onDelete={removeNote}
          />
        )}
        keyExtractor={(item) => item.key}
        numColumns={1}  // Display 2 items per row
        columnWrapperStyle={styles.row} // Add some spacing between rows
        contentContainerStyle={styles.scrollViewContent} // Use this for padding/margin
      />
  
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddNotes')}
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
    backgroundColor: '#474F7A',
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
