import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('cartItems')
      .onSnapshot(querySnapshot => {
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(items);
        setLoading(false);
      }, error => {
        console.error('Error fetching cart items:', error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  // Remove item from cart
  const removeFromCart = async (id) => {
    try {
      await firestore().collection('cartItems').doc(id).delete();
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  // Update quantity in Firestore
  const updateQuantity = async (id, increment) => {
    try {
      const itemRef = firestore().collection('cartItems').doc(id);
      const doc = await itemRef.get();

      if (!doc.exists) {
        console.error('Document not found for updating quantity:', id);
        return;
      }

      const currentQuantity = doc.data().quantity || 0; // Default to 0 if not present
      console.log(`Current quantity for ${id}: ${currentQuantity}`); // Debug log

      const newQuantity = Math.max(currentQuantity + increment, 1); // Ensure quantity stays at least 1
      console.log(`New quantity for ${id}: ${newQuantity}`); // Debug log

      await itemRef.update({ quantity: newQuantity });
      // Update local state
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Handle Buy Now functionality
  const handleBuy = async (item) => {
    await removeFromCart(item.id);
    navigation.navigate('OrderScreen', { purchasedItems: [item] });
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUri }} style={styles.cartImage} />
      <View style={styles.cartDetails}>
        <Text style={styles.cartName}>{item.name}</Text>
        <Text style={styles.cartPrice}>${item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} disabled={(item.quantity || 1) <= 1}>
            <Text style={[styles.icon, (item.quantity || 1) <= 1 && styles.disabled]}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity || 1}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
            <Text style={styles.icon}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.buyButton} 
          onPress={() => handleBuy(item)}
        >
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.removeButton} 
          onPress={() => removeFromCart(item.id)}
        >
          <Text style={styles.icon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" />
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>}
        />
      )}
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 20,
  },
  title: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#2b2b2b',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
    elevation: 5,
  },
  cartImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cartDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  cartName: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartPrice: {
    color: '#fff',
    fontSize: 16,
    marginTop: 5,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityText: {
    color: '#fff',
    fontSize: 18,
    paddingHorizontal: 10,
  },
  buyButton: {
    marginTop: 10,
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  icon: {
    fontSize: 24,
    color: '#FFD700',
  },
  disabled: {
    color: 'gray',
  },
});

export default CartScreen;
