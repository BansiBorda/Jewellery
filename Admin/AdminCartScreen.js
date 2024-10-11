import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';

const AdminCartScreen = () => {
    const [usersCartItems, setUsersCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const firestore = getFirestore();

    useEffect(() => {
        const fetchUsersCartItems = async () => {
            try {
                const usersRef = collection(firestore, 'users');
                const usersSnapshot = await getDocs(usersRef);

                const cartData = [];

                for (const userDoc of usersSnapshot.docs) {
                    const userId = userDoc.id;
                    const userData = userDoc.data();
                    const userEmail = userData.email || 'No email provided';

                    const cartRef = collection(firestore, 'users', userId, 'cartItems');
                    const cartSnapshot = await getDocs(cartRef);

                    const cartItems = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    if (cartItems.length > 0) {
                        cartData.push({
                            userId,
                            userEmail,
                            cartItems,
                        });
                    }
                }

                setUsersCartItems(cartData);
            } catch (error) {
                console.error('Failed to fetch user cart items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsersCartItems();
    }, [firestore]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6666" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Admin Cart Overview</Text>
            {usersCartItems.length === 0 ? (
                <Text style={styles.emptyMessage}>No cart items available.</Text>
            ) : (
                usersCartItems.map((userData, index) => (
                    <View key={index} style={styles.userContainer}>
                        <Text style={styles.userId}>User ID: {userData.firstName}</Text>
                        <Text style={styles.userEmail}>Email: {userData.userEmail}</Text>
                        {userData.cartItems.map((cartItem) => (
                            <View key={cartItem.id} style={styles.cartItem}>
                                <Image source={{ uri: cartItem.imageUri }} style={styles.productImage} />
                                <View style={styles.cartDetails}>
                                    <Text style={styles.cartItemName}>{cartItem.name}</Text>
                                    <Text style={styles.cartItemPrice}>€{cartItem.price}</Text>
                                    <Text style={styles.cartItemQuantity}>Qty: {cartItem.quantity}</Text>
                                    <Text style={styles.cartItemStatus}>Status: <Text style={styles.pendingStatus}>Pending</Text></Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    emptyMessage: {
        fontSize: 18,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
    userContainer: {
        marginBottom: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    userId: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    userEmail: {
        fontSize: 16,
        marginBottom: 10,
        color: '#666',
    },
    cartItem: {
        flexDirection: 'row',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#F0F0F0',
        borderRadius: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 5,
        marginRight: 10,
    },
    cartDetails: {
        flex: 1,
    },
    cartItemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cartItemPrice: {
        fontSize: 16,
        color: '#FF6666',
    },
    cartItemQuantity: {
        fontSize: 16,
        color: '#666',
    },
    cartItemStatus: {
        fontSize: 16,
        color: '#333',
    },
    pendingStatus: {
        color: '#FF6666',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },
});

export default AdminCartScreen;
