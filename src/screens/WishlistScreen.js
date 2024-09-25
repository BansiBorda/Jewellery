import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { getFirestore, collection, deleteDoc, doc, getDocs, addDoc } from '@react-native-firebase/firestore';

const WishlistScreen = ({ navigation }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const firestore = getFirestore();

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
    });

    const handleAddToCart = async (item) => {
        const cartRef = collection(firestore, 'cartItems');
        const querySnapshot = await getDocs(cartRef);
        const cartItems = querySnapshot.docs.map(doc => doc.data());
        const isItemInCart = cartItems.some(cartItem => cartItem.id === item.id);

        if (!isItemInCart) {
            await addDoc(cartRef, item);
            alert('Item added to cart!');
            navigation.navigate('Cart'); // Navigate to CartScreen
        } else {
            alert('Item is already in the cart!');
        }
    };

    if (loading) {
        return <Text style={styles.loadingText}>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
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
                            <TouchableOpacity style={styles.button} onPress={() => handleAddToCart(item)}>
                                <Text style={styles.buttonText}>Add to Cart</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    loadingText: {
        color: '#FFD700',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 50,
    },
    wishlistItem: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#1e1e1e',
        padding: 15,
        borderRadius: 10,
    },
    wishlistImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
    },
    wishlistDetails: {
        flex: 1,
    },
    name: {
        color: '#FFD700',
        fontSize: 18,
    },
    price: {
        color: '#FFD700',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#FFD700',
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default WishlistScreen;
