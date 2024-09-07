import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const CartScreen = ({ route }) => {
  // Get cart items from route params
  const cartItems = route.params?.cartItems || [];

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.emptyCart}>Your cart is empty</Text>
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'gold',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#222',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
  },
  itemName: {
    fontSize: 18,
    color: '#fff',
  },
  itemPrice: {
    fontSize: 16,
    color: 'gold',
    marginTop: 5,
  },
  emptyCart: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});

export default CartScreen;
