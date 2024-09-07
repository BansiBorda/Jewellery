import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const AdminFormScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const firestore = getFirestore();

  const handleAddItem = async () => {
    try {
      await addDoc(collection(firestore, 'jewelryItems'), {
        name,
        price: parseFloat(price),
        imageUri,
        description,
        category: 'all' // Modify as needed
      });
      setMessage('Item added successfully');
      setName('');
      setPrice('');
      setImageUri('');
      setDescription('');
    } catch (error) {
      setMessage('Failed to add item');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Item Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter item name"
      />
      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        value={imageUri}
        onChangeText={setImageUri}
        placeholder="Enter image URL"
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
      />
      <Button title="Add Item" onPress={handleAddItem} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
    flex: 1,
  },
  label: {
    color: 'gold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1c1c1c',
    color: 'white',
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
});

export default AdminFormScreen;
