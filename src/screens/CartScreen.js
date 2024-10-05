import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ToastAndroid, Image, Modal } from 'react-native';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const { width } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const firestore = getFirestore();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) { return; } // No user logged in

        const cartRef = collection(firestore, 'users', currentUser.uid, 'cartItems');
        const querySnapshot = await getDocs(cartRef);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCartItems(items);
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    };

    fetchCartItems();
  }, [firestore]);

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleItemPurchase = async () => {
    if (!selectedItem) { return; }

    const currentUser = auth().currentUser;
    if (!currentUser) { return; } // No user logged in

    try {
      // Add the purchased item to the purchaseItems collection
      const purchaseRef = collection(firestore, 'users', currentUser.uid, 'purchaseItems');
      await addDoc(purchaseRef, {
        name: selectedItem.name,
        price: selectedItem.price,
        quantity: selectedItem.quantity,
        imageUri: selectedItem.imageUri,
        purchasedAt: new Date(), // Optional: to track when it was purchased
      });

      // Remove the purchased item from the cart
      const cartItemRef = doc(firestore, 'users', currentUser.uid, 'cartItems', selectedItem.id);
      await deleteDoc(cartItemRef);

      // Update local state
      setCartItems(cartItems.filter(item => item.id !== selectedItem.id));

      // Show success message
      ToastAndroid.show(`${selectedItem.name} purchased!`, ToastAndroid.SHORT);
    } catch (error) {
      console.error('Failed to purchase item:', error);
    } finally {
      setModalVisible(false);
      setSelectedItem(null); // Clear the selected item
    }
  };

  const handleCheckout = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) { return; } // No user logged in

      // Handle overall checkout logic here

      ToastAndroid.show('Checkout successful!', ToastAndroid.SHORT);
      // Clear cart logic can be added here
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

 const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0).toFixed(2);
};


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyMessage}>Your cart is empty.</Text>
      ) : (
        <>
          <View>
            {cartItems.map((item, index) => (
              <TouchableOpacity key={`${item.id}-${index}`} onPress={() => handleItemPress(item)}>
                <View style={styles.cartItem}>
                  <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>€{(Number(item.price) * Number(item.quantity))}</Text>
                    <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}


            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total Price: €{calculateTotalPrice()}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.buttonText}>Checkout All</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedItem.name}</Text>
              <Image source={{ uri: selectedItem.imageUri }} style={styles.modalImage} />
              <Text style={styles.modalPrice}>Price: €{(Number(selectedItem.price)).toFixed(2)}</Text>
              <Text style={styles.modalQuantity}>Quantity: {selectedItem.quantity}</Text>
              <Text style={styles.modalTotal}>Total: €{(Number(selectedItem.price) * Number(selectedItem.quantity)).toFixed(2)}</Text>

              <TouchableOpacity style={styles.modalCheckoutButton} onPress={handleItemPurchase}>
                <Text style={styles.buttonText}>Purchase This Item</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 18,
    color: '#FF6666',
    marginVertical: 5,
  },
  itemQuantity: {
    fontSize: 16,
    color: '#666',
  },
  totalContainer: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  checkoutButton: {
    backgroundColor: '#FF6666',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalImage: {
    width: 150,
    height: 150,
    marginBottom: 15,
    borderRadius: 10,
  },
  modalPrice: {
    fontSize: 20,
    color: '#333',
    marginBottom: 5,
  },
  modalQuantity: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  modalTotal: {
    fontSize: 22,
    color: '#FF6666',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  modalCheckoutButton: {
    backgroundColor: '#FF6666',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
});

export default CartScreen;
