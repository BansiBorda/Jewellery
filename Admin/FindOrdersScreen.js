import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const FindOrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('orders')
            .orderBy('orderDate', 'desc')
            .onSnapshot((querySnapshot) => {
                const ordersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setOrders(ordersData);
                setLoading(false);
            });

        return () => unsubscribe();
    }, []);

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderContainer}>
            <Image source={{ uri: item.imageUri }} style={styles.orderImage} />
            <View style={styles.orderDetails}>
                <Text style={styles.orderName}>{item.name}</Text>
                <Text style={styles.orderPrice}>
                    ${(item.price ? item.price * (item.quantity || 1) : 0).toFixed(2)}
                </Text>
                <Text style={styles.orderDate}>Ordered: {new Date(item.orderDate.toDate()).toLocaleString()}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Orders</Text>
            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={<Text style={styles.emptyText}>No orders available.</Text>}
                />
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
    title: {
        color: '#FFD700',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    orderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#1c1c1c',
        borderRadius: 8,
        elevation: 3,
    },
    orderImage: {
        width: 80,
        height: 80,
        borderRadius: 5,
        marginRight: 10,
    },
    orderDetails: {
        flex: 1,
    },
    orderName: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orderPrice: {
        color: '#fff',
        fontSize: 16,
    },
    orderDate: {
        color: '#A9A9A9',
        fontSize: 12,
    },
    loadingText: {
        color: '#FFD700',
        textAlign: 'center',
    },
    emptyText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default FindOrdersScreen;
