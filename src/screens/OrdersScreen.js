import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, collection, addDoc, deleteDoc, doc } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const OrderScreen = ({ route, navigation }) => {
    const { purchasedItems } = route.params;
    const [isProcessing, setIsProcessing] = useState(false);

    const calculateTotal = (items) => {
        return items.reduce((total, item) => {
            return total + (item.price * (item.quantity || 1));
        }, 0).toFixed(2);
    };

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            const currentUser = auth().currentUser;
            if (!currentUser) throw new Error("User is not logged in");

            const firestore = getFirestore();
            const ordersRef = collection(firestore, 'users', currentUser.uid, 'orders');
            const cartRef = collection(firestore, 'users', currentUser.uid, 'cartItems');

            // Add order to 'orders' collection
            await addDoc(ordersRef, {
                items: purchasedItems,
                total: calculateTotal(purchasedItems),
                date: new Date().toISOString()
            });

            // Clear cart
            for (let item of purchasedItems) {
                await deleteDoc(doc(cartRef, item.id));
            }

            Alert.alert('Success', 'Your order has been confirmed!', [
                { text: 'OK', onPress: () => navigation.navigate('Home') },
            ]);
        } catch (error) {
            console.error('Error processing order:', error);
            Alert.alert('Error', 'Failed to process your order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderContainer}>
            <Image source={{ uri: item.imageUri }} style={styles.orderImage} />
            <View style={styles.orderDetails}>
                <Text style={styles.orderTitle}>{item.name}</Text>
                <Text style={styles.orderPrice}>${item.price}</Text>
                <Text style={styles.orderQuantity}>Quantity: {item.quantity || 1}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Order Summary</Text>
            <FlatList
                data={purchasedItems}
                renderItem={renderOrderItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No items in the order.</Text>}
                style={styles.list}
            />
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total: ${calculateTotal(purchasedItems)}</Text>
            </View>
            <TouchableOpacity 
                style={[styles.confirmButton, isProcessing && styles.disabledButton]} 
                onPress={handleConfirm}
                disabled={isProcessing}
            >
                <Text style={styles.confirmButtonText}>
                    {isProcessing ? 'Processing...' : 'Confirm Order'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    title: {
        color: '#FFD700',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    list: {
        marginBottom: 20,
    },
    orderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    orderImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
    },
    orderDetails: {
        flex: 1,
    },
    orderTitle: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orderPrice: {
        color: '#fff',
        fontSize: 16,
        marginVertical: 2,
    },
    orderQuantity: {
        color: '#B0B0B0',
        fontSize: 14,
    },
    totalContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        elevation: 4,
    },
    totalText: {
        color: '#FFD700',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    confirmButton: {
        marginTop: 20,
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 3,
    },
    disabledButton: {
        backgroundColor: '#808080',
    },
    confirmButtonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default OrderScreen;