import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { getFirestore, collection, getDocs, addDoc } from '@react-native-firebase/firestore';

const WishlistScreen = ({ navigation }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const firestore = getFirestore();

    // Fetch wishlist items
    const fetchWishlistItems = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'wishlistItems'));
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWishlistItems(items);
        } catch (error) {
            console.error('Failed to fetch wishlist items:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlistItems();
    }); // Ensure the effect runs only once

    // Add item to cart
    const handleAddToCart = async (item) => {
        try {
            const cartRef = collection(firestore, 'cartItems');
            const querySnapshot = await getDocs(cartRef);
            const cartItems = querySnapshot.docs.map(doc => doc.data());
            const isItemInCart = cartItems.some(cartItem => cartItem.id === item.id);

            if (!isItemInCart) {
                await addDoc(cartRef, item);
                Alert.alert('Success', 'Item added to cart!');
                navigation.navigate('Cart');
            } else {
                Alert.alert('Info', 'Item is already in the cart!');
            }
        } catch (error) {
            console.error('Failed to add item to cart:', error);
            Alert.alert('Error', 'Failed to add item to cart.');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFB6C1" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Wishlist</Text>
            {wishlistItems.length === 0 ? (
                <Text style={styles.emptyText}>No items in your wishlist.</Text>
            ) : (
                <FlatList
                    data={wishlistItems}
                    renderItem={({ item }) => (
                        <View style={styles.wishlistItem}>
                            <TouchableOpacity onPress={() => navigation.navigate('Product', { item })}>
                                <Image source={{ uri: item.imageUri }} style={styles.wishlistImage} />
                            </TouchableOpacity>
                            <View style={styles.wishlistDetails}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.price}>${item.price}</Text>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleAddToCart(item)}
                                >
                                    <Text style={styles.buttonText}>Add to Cart</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.flatListContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        color: '#FFB6C1',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'Arial', // Change font family here
    },
    emptyText: {
        color: '#FFB6C1',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'Arial', // Change font family here
    },
    header: {
        fontSize: 28, // Increased font size
        fontWeight: 'bold',
        color: '#FFB6C1',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: 'Arial', // Change font family here
    },
    flatListContainer: {
        paddingHorizontal: 5,
        paddingBottom: 20,
    },
    wishlistItem: {
        flex: 1,
        margin: 10,
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12, // Slightly larger corner radius
        borderColor: '#FFB6C1',
        borderWidth: 1,
        shadowColor: '#FFB6C1',
        shadowOffset: { width: 0, height: 4 }, // More shadow depth
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4, // Increased elevation for Android
    },
    wishlistImage: {
        width: '100%',
        height: 150, // Increased height for better image visibility
        borderRadius: 12, // Match with wishlist item border radius
        marginBottom: 10,
    },
    wishlistDetails: {
        justifyContent: 'center',
    },
    name: {
        color: '#5B3A29',
        fontSize: 18, // Increased font size for item name
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'Arial', // Change font family here
    },
    price: {
        color: '#FFB6C1',
        fontSize: 16, // Slightly larger font size
        marginVertical: 5,
        fontFamily: 'Arial', // Change font family here
    },
    button: {
        backgroundColor: '#FFB6C1',
        paddingVertical: 12, // Increased padding for a more spacious button
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Arial', // Change font family here
    },
});

export default WishlistScreen;
