import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from '@react-native-firebase/firestore';

const CompletedOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const firestore = getFirestore();

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const q = query(collection(firestore, 'orders'), where('status', '==', 'Completed'));
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Failed to fetch completed orders:', error);
      }
    };

    fetchCompletedOrders();
  });

  const handleOrderPress = (order) => {
    Alert.alert("Order Details", `Order ID: ${order.id}\nName: ${order.name}\nStatus: ${order.status}\nTotal Price: $${(order.price * (order.quantity || 1)).toFixed(2)}`, [{ text: "OK" }]);
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleOrderPress(item)}>
      <Text style={styles.itemText}>Order ID: {item.id}</Text>
      <Text style={styles.itemText}>Name: {item.name}</Text>
      <Text style={styles.itemText}>Status: {item.status}</Text>
      <Text style={styles.itemText}>Total Price: ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</Text>
      <Text style={styles.itemText}>Ordered On: {new Date(item.orderDate.toDate()).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No completed orders available.</Text>}
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
  title: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    elevation: 3,
  },
  itemText: {
    color: 'white',
    fontSize: 16,
    marginVertical: 2,
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CompletedOrdersScreen;
