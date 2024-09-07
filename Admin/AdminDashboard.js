import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, Button } from 'react-native';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const AdminDashboardScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('necklace');
  const [jewelryItems, setJewelryItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);

  const firestore = getFirestore();
  const navigation = useNavigation();  // Hook for navigation

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
  }, );

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
        setName('');
        setPrice('');
        setImageUri('');
        setDescription('');
        setCategory('necklace');
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
        setEditingItemId(null);
        setName('');
        setPrice('');
        setImageUri('');
        setDescription('');
        setCategory('necklace');
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
    setPrice(item.price);
    setImageUri(item.imageUri);
    setDescription(item.description);
    setCategory(item.category);
  };

  const filterJewelryItems = () => {
    if (category === 'All') {
      return jewelryItems;
    } else {
      return jewelryItems.filter(item => item.category === category);
    }
  };

   React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('AnotherScreen'); // or any fallback screen
            }
          }}
        >
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Image URL"
        value={imageUri}
        onChangeText={setImageUri}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[styles.categoryButton, category === 'necklace' && styles.selectedCategory]}
          onPress={() => setCategory('necklace')}
        >
          <Text style={styles.categoryText}>Necklace</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryButton, category === 'bangle' && styles.selectedCategory]}
          onPress={() => setCategory('bangle')}
        >
          <Text style={styles.categoryText}>Bangle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryButton, category === 'earring' && styles.selectedCategory]}
          onPress={() => setCategory('earring')}
        >
          <Text style={styles.categoryText}>Earring</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryButton, category === 'All' && styles.selectedCategory]}
          onPress={() => setCategory('All')}
        >
          <Text style={styles.categoryText}>All</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={editingItemId ? updateItem : addItem}
      >
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
              <Button title="Edit" onPress={() => startEditItem(item)} />
              <Button title="Delete" onPress={() => deleteItem(item.id)} />
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
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#121212',
    backgroundColor: 'gold',
    paddingVertical: 10,
    textAlign: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#1c1c1c',
    padding: 12,
    marginBottom: 12,
    color: 'white',
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1c1c1c',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#444',
  },
  selectedCategory: {
    backgroundColor: 'gold',
    borderColor: 'gold',
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'gold',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#121212',
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
    backgroundColor: '#1c1c1c',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderColor: 'gold',
    borderWidth: 2,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemText: {
    color: 'white',
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '500',
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AdminDashboardScreen;
