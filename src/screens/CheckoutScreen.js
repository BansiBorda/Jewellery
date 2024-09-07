import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const CheckoutScreen = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        placeholderTextColor="#ccc"
      />
      <Button title="Place Order" onPress={() => alert('Order Placed!')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    color: '#FFD700',
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#FFD700',
    borderBottomWidth: 1,
    marginBottom: 20,
    color: '#fff',
    paddingHorizontal: 10,
  },
});

export default CheckoutScreen;
