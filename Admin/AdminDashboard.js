import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

// Set the logout emoji image URL
const logoutEmoji = { uri: 'https://icons.iconarchive.com/icons/custom-icon-design/pretty-office-6/128/logout-icon.png' };

const AdminDashboardScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('necklace');
  const [jewelryItems, setJewelryItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);

  const firestore = getFirestore();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'jewelryItems'));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJewelryItems(items);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    };

    fetchItems();
  }, [firestore]);

  const addItem = async () => {
    if (name && price && imageUri && description && category) {
      try {
        await addDoc(collection(firestore, 'jewelryItems'), {
          name,
          price,
          imageUri,
          description,
          category,
        });
        clearForm();
      } catch (error) {
        console.error('Failed to add item:', error);
      }
    }
  };

  const updateItem = async () => {
    if (editingItemId && name && price && imageUri && description && category) {
      try {
        await updateDoc(doc(firestore, 'jewelryItems', editingItemId), {
          name,
          price,
          imageUri,
          description,
          category,
        });
        clearForm();
      } catch (error) {
        console.error('Failed to update item:', error);
      }
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'jewelryItems', id));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const startEditItem = (item) => {
    setEditingItemId(item.id);
    setName(item.name);
    setPrice(item.price.toString());
    setImageUri(item.imageUri);
    setDescription(item.description);
    setCategory(item.category);
  };

  const clearForm = () => {
    setEditingItemId(null);
    setName('');
    setPrice('');
    setImageUri('');
    setDescription('');
    setCategory('necklace');
  };

  const filterJewelryItems = () => {
    return category === 'All' ? jewelryItems : jewelryItems.filter(item => item.category === category);
  };

  // Set up header options with a logout button using the custom emoji
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('AdminLogin')}>
          <Image source={logoutEmoji} style={styles.logoutImage} />
          {/* Add a Text component to ensure proper rendering */}
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      ),
      headerTitle: () => <Text style={styles.headerTitle}>Admin Dashboard</Text>,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} placeholderTextColor="#888" />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" placeholderTextColor="#888" />
      <TextInput placeholder="Image URL" value={imageUri} onChangeText={setImageUri} style={styles.input} placeholderTextColor="#888" />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} placeholderTextColor="#888" />
      <View style={styles.categoryContainer}>
        {['necklace', 'bangle', 'earring', 'All'].map((cat) => (
          <TouchableOpacity key={cat} style={[styles.categoryButton, category === cat && styles.selectedCategory]} onPress={() => setCategory(cat)}>
            <Text style={styles.categoryText}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={editingItemId ? updateItem : addItem}>
        <Text style={styles.buttonText}>{editingItemId ? 'Update Item' : 'Add Item'}</Text>
      </TouchableOpacity>
      <FlatList
        data={filterJewelryItems()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemText}>Name: {item.name}</Text>
              <Text style={styles.itemText}>Price: ${item.price}</Text>
              <Text style={styles.itemText}>Category: {item.category}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => startEditItem(item)}>
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => deleteItem(item.id)}>
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row', // Ensure items are in a row
    alignItems: 'center', // Center the content vertically
  },
  logoutImage: {
    width: 30, // Set your desired width for the logout emoji
    height: 30, // Set your desired height for the logout emoji
  },
  logoutText: {
    marginLeft: 5, // Add some space between the image and text
    color: '#333', // Text color for visibility
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FF6F91',
    padding: 12,
    marginBottom: 12,
    color: '#333',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    flex: 1,
    margin: 4,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FF6F91',
    borderRadius: 20,
  },
  selectedCategory: {
    backgroundColor: '#FF9AAB',
  },
  categoryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF9AAB',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    marginTop: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#FF6F91',
    borderRadius: 5,
    padding: 5,
    marginLeft: 5,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default AdminDashboardScreen;
