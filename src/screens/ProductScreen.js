import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from '@react-native-firebase/firestore';

const ProductScreen = ({ route, navigation }) => {
    const { item } = route.params || {};
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const firestore = getFirestore();

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'wishlistItems'));
                const wishlistItems = querySnapshot.docs.map(doc => doc.data());
                setIsInWishlist(wishlistItems.some(wishlistItem => wishlistItem.id === item.id));
            } catch (error) {
                console.error('Failed to fetch wishlist:', error);
            }
        };

        fetchWishlist();
    }, [item.id, firestore]);

    const handleAddToCart = async () => {
        try {
            const cartRef = collection(firestore, 'cartItems');
            const querySnapshot = await getDocs(cartRef);
            const cartItems = querySnapshot.docs.map(doc => doc.data());
            const isItemInCart = cartItems.some(cartItem => cartItem.id === item.id);

            if (!isItemInCart) {
                await addDoc(cartRef, item);
                setModalMessage('Item added to cart!');
                setIsModalVisible(true);
                setTimeout(() => {
                    setIsModalVisible(false);
                    navigation.navigate('Cart'); // Navigate to CartScreen
                }, 1000); // Wait for the modal to show for a second
            } else {
                setModalMessage('Item is already in the cart!');
                setIsModalVisible(true);
            }
        } catch (error) {
            console.error('Failed to add item to cart:', error);
        }
    };

    const handleToggleWishlist = async () => {
        try {
            const wishlistRef = collection(firestore, 'wishlistItems');
            const querySnapshot = await getDocs(wishlistRef);
            const wishlistItems = querySnapshot.docs;

            const existingWishlistItem = wishlistItems.find(wishlistItem => wishlistItem.data().id === item.id);

            if (existingWishlistItem) {
                await deleteDoc(doc(wishlistRef, existingWishlistItem.id));
                setIsInWishlist(false);
                alert('Item removed from wishlist');
            } else {
                await addDoc(wishlistRef, item);
                setIsInWishlist(true);
                alert('Item added to wishlist');
            }
        } catch (error) {
            console.error('Failed to update wishlist:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: item.imageUri }} style={styles.image} />
            <View style={styles.header}>
                <Text style={styles.name}>{item.name}</Text>
                <TouchableOpacity onPress={handleToggleWishlist}>
                    <Text style={styles.emoji}>{isInWishlist ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.description}>{item.description}</Text>

            <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
                <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>

            <View style={styles.reviewsSection}>
                <Text style={styles.reviewsTitle}>Reviews</Text>
                <Text style={styles.review}>No reviews yet.</Text>
            </View>

            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFD700',
        marginBottom: 20,
    },
    name: {
        color: '#FFD700',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    price: {
        color: '#FFD700',
        fontSize: 22,
        marginBottom: 20,
    },
    description: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    reviewsSection: {
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#444',
    },
    reviewsTitle: {
        color: '#FFD700',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    review: {
        color: '#fff',
        fontSize: 16,
    },
    emoji: {
        fontSize: 28,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        color: '#000',
    },
});

export default ProductScreen;
