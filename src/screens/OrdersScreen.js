import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';

const OrderScreen = ({ route, navigation }) => {
    const { purchasedItems } = route.params;

    // Filter out unwanted items (adjust the condition as needed)
    const validPurchasedItems = purchasedItems.filter(item => item && item.id && item.price);

    const calculateTotal = (items) => {
        return items.reduce((total, item) => {
            return total + (item.price * (item.quantity || 1));
        }, 0).toFixed(2);
    };

    const handleConfirm = () => {
        Alert.alert('Success', 'Your order has been confirmed!', [
            { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderContainer}>
            <Image source={{ uri: item.imageUri }} style={styles.orderImage} />
            <View style={styles.orderDetails}>
                <Text style={styles.orderTitle}>{item.title}</Text>
                <Text style={styles.orderPrice}>${item.price}</Text>
                <Text>Quantity: {item.quantity || 1}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={validPurchasedItems} // Use the filtered items
                renderItem={renderOrderItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No items in the order.</Text>} // Handle empty state
            />
            <Text style={styles.totalText}>Total: ${calculateTotal(validPurchasedItems)}</Text>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirm Order</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E2F',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        color: '#FFD700',
        fontSize: 32,
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
        backgroundColor: '#2C2C3A',
        borderRadius: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    orderImage: {
        width: 90,
        height: 90,
        borderRadius: 10,
        marginRight: 15,
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
        marginVertical: 2,
    },
    orderQuantity: {
        color: '#B0B0B0',
        fontSize: 14,
    },
    totalContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#2C2C3A',
        borderRadius: 10,
        elevation: 4,
        alignItems: 'flex-end',
    },
    totalText: {
        color: '#FFD700',
        fontSize: 24,
        fontWeight: 'bold',
    },
    confirmButton: {
        marginTop: 10,
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 3,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default OrderScreen;
