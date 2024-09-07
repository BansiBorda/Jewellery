// ManageJewelryScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ManageJewelryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Manage Jewelry Items Here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ManageJewelryScreen;
