import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const CreateNotes = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name='arrow-back' size={28} color='#6a00ff' />
        </TouchableOpacity>
        <Text style={styles.title}>NotIQ</Text>
      </View>

      <Text style={styles.subtitle}>Your Notes</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} placeholder='Note Title... '/>

      <Text style={styles.label}>Category</Text>
      <TextInput style={styles.input} placeholder='Work/School/Personal '/>
      
      <Text style={styles.label}>Note</Text>
      <TextInput multiline style={styles.textarea} placeholder='Write your notes here... '/>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CreateNotes

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f2ff",
    padding: 20,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginLeft: 10,
    color: "#6a00ff",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#444",
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: "#777",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  textarea: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 25,
    height: 150,
  },
  saveButton: {
    backgroundColor: '#6a00ff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center'
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});