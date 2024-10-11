import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ToastAndroid,
} from 'react-native';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

const ProductScreen = ({ route, navigation }) => {
    const { item } = route.params || {};
    const [selectedSize, setSelectedSize] = useState('10');
    const [quantity, setQuantity] = useState(1);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const firestore = getFirestore();

    // Calculate total price based on quantity without using toFixed
    const totalPrice = item.price * quantity;

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'wishlistItems'));
                const wishlistItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setIsInWishlist(wishlistItems.some(wishlistItem => wishlistItem.id === item.id));
            } catch (error) {
                console.error('Failed to fetch wishlist:', error);
            }
        };

        fetchWishlist();
    }, [item.id, firestore]);

    const handleAddToCart = async () => {
        try {
            const currentUser = auth().currentUser;
            if (!currentUser) {
                throw new Error('User is not logged in');
            }

            const cartRef = collection(firestore, 'users', currentUser.uid, 'cartItems');
            // Add the item along with its quantity to Firestore
            await addDoc(cartRef, { ...item, quantity });
            ToastAndroid.show('Added to cart!', ToastAndroid.SHORT);
            navigation.navigate('Cart'); // Navigate to Cart screen after adding
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
                ToastAndroid.show('Removed from wishlist', ToastAndroid.SHORT);
            } else {
                await addDoc(wishlistRef, item);
                setIsInWishlist(true);
                ToastAndroid.show('Added to wishlist!', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error('Failed to update wishlist:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.pageIndicator}>01/07</Text>
                <TouchableOpacity onPress={handleToggleWishlist}>
                    <Image
                        source={{
                            uri: isInWishlist
                                ? 'https://www.clipartmax.com/png/full/296-2961300_heart-love-red-whatsapp-emoji-emotion-emotions-big-heart-emoji.png'
                                : 'https://emojigraph.org/media/emojipedia/white-heart_1f90d.png',
                        }}
                        style={styles.wishlistIcon}
                    />
                </TouchableOpacity>
            </View>

            <Image source={{ uri: item.imageUri }} style={styles.image} />

            <View style={styles.contentContainer}>
                <Text style={styles.collection}>Mother's Day Collection 2020</Text>
                <Text style={styles.name}>{item.name}</Text>

                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>Width</Text>
                        <Text style={styles.infoValue}>{item.width || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>Weight</Text>
                        <Text style={styles.infoValue}>{item.weight || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>Gold Karat</Text>
                        <Text style={styles.infoValue}>{item.karat || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>Warranty</Text>
                        <Text style={styles.infoValue}>{item.warranty || 'N/A'}</Text>
                    </View>
                </View>


                <View style={styles.controlsContainer}>
                    <View style={styles.pickerContainer}>
                        <Text style={styles.pickerLabel}>Size</Text>
                        <Picker
                            selectedValue={selectedSize}
                            onValueChange={(itemValue) => setSelectedSize(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="10" value="10" />
                            <Picker.Item label="11" value="11" />
                            <Picker.Item label="12" value="12" />
                        </Picker>
                    </View>

                    <View style={styles.quantityContainer}>
                        <Text style={styles.pickerLabel}>Quantity</Text>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                                <Text style={styles.quantityControlButton}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                                <Text style={styles.quantityControlButton}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.price}>€{totalPrice}</Text>
                </View>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <Text style={styles.buttonText}>Add to cart</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    pageIndicator: {
        color: '#333', // Darker color for better contrast
        fontSize: 16,
    },
    wishlistIcon: {
        width: 24,
        height: 24,
    },
    image: {
        width: width,
        height: width * 1.2,
        resizeMode: 'cover',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    contentContainer: {
        padding: 20,
        backgroundColor: '#f8f8f8',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginTop: -20,
    },
    collection: {
        color: '#777',
        fontSize: 14,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#333', // Darker color for better visibility
    },
    infoContainer: {
        marginVertical: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    infoTitle: {
        color: '#555', // Use a darker color
        fontSize: 16,
    },
    infoValue: {
        fontWeight: 'bold',
        color: '#333', // Darker color for better contrast
    },
    controlsContainer: {
        marginVertical: 20,
    },
    pickerContainer: {
        marginVertical: 10,
    },
    pickerLabel: {
        fontSize: 16,
        color: '#333', // Darker color
    },
    picker: {
        height: 50,
    },
    quantityContainer: {
        marginVertical: 10,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityControlButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        width: 30,
        textAlign: 'center',
        fontSize: 20,
        color: '#333', // Ensure buttons are visible
    },
    quantityText: {
        marginHorizontal: 15,
        fontSize: 18,
        color: '#333', // Darker text color
    },
    priceContainer: {
        marginVertical: 10,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333', // Ensure price is visible
    },
    addToCartButton: {
        backgroundColor: '#FF9999',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});


export default ProductScreen;
