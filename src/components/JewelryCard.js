// JewelryCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const JewelryCard = ({ route }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <Image source={item.imageUri} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.price}>${item.price}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  image: {
    width: windowWidth - 40,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 15,
  },
  name: {
    color: 'gold',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  category: {
    color: 'white',
    fontSize: 18,
    marginTop: 5,
  },
  price: {
    color: 'gold',
    fontSize: 20,
    marginTop: 5,
  },
  description: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
});

export default JewelryCard;
