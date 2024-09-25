import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';

const CheckoutScreen = ({ route, navigation }) => {
    const { cartItems } = route.params;
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    const handlePlaceOrder = () => {
        // Placeholder for payment and order processing
        alert('Order placed successfully!');
        navigation.navigate('HomeScreen');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Checkout</Text>
            <FlatList
                data={cartItems}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemPrice}>${item.price} x {item.quantity}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text>No items in cart.</Text>}
            />
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
            />
            <Button title="Place Order" onPress={handlePlaceOrder} />
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        backgroundColor: '#1c1c1c',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    itemName: {
        color: '#FFD700',
        fontSize: 18,
    },
    itemPrice: {
        color: '#FFD700',
        fontSize: 16,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
    },
});

export default CheckoutScreen;
