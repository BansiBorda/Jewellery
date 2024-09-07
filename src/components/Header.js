import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import from react-native-vector-icons

const Header = ({ title, onCartPress, onBackPress }) => (
  <View style={styles.header}>
    {onBackPress && (
      <TouchableOpacity onPress={onBackPress} style={styles.iconContainer}>
        <Ionicons name="arrow-back-outline" size={28} color="#fff" />
      </TouchableOpacity>
    )}
    <Text style={styles.title}>{title}</Text>
    <TouchableOpacity onPress={onCartPress} style={styles.iconContainer}>
      <Ionicons name="cart-outline" size={28} color="#fff" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#000', // Set to black or another dark color
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Optional: Add a border for better separation
  },
  title: {
    color: '#fff',
    fontSize: 22,
  },
  iconContainer: {
    padding: 10,
  },
});

export default Header;
