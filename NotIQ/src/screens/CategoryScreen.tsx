import { StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import NoteCard from '../components/NoteCard';

const CategoryScreen = ({route, navigation}) => {
  const {category} = route.params;

  return (
    <View style={styles.container}>
     <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name='chevron-back' size={28} color='#6a00ff'/>
      </TouchableOpacity>
      <Text style={styles.title}>Work</Text>
     </View>

     <ScrollView showsVerticalScrollIndicator={false}>
      <NoteCard title='Meeting Notes' text='Discussed UI Layout...' date='14-12-2025'/>
     </ScrollView>
    </View>
  )
}

export default CategoryScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f2ff',
    padding: 20,
    width: '100%'
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginLeft: 10,
    color: '#6a00ff',
  },
});