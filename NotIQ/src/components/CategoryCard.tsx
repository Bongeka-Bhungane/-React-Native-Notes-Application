import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

type CategoryProps = {
    name: string,
    color: string,
    onPress?: () => void,
}

const CategoryCard : React.FC<CategoryProps> =  ({ name, color, onPress }) => {
  return (
    <TouchableOpacity style={[styles.card, {backgroundColor:color}]} onPress={onPress}>
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  )
}

export default CategoryCard

const styles = StyleSheet.create({
    card: {
        padding: 25,
        borderRadius: 18,
        marginBottom: 15,
    },
    text: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333'
    }
})