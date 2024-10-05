import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Dimensions, Text, TouchableOpacity, Animated, Image, SafeAreaView, ScrollView, Linking, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';

// Slider images
const sliderImages = [
  { uri: 'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw3db19e7a/homepage/ShopByCollection/string-it.jpg' },
  { uri: 'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwb292158a/homepage/NewForYou/pretty-in-pink-new.jpg' },
  { uri: 'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw89ef1e4a/homepage/shopByCategory/diamond-necklace-set.jpg' },
];

const windowWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const [jewelryItems, setJewelryItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const scrollX = useRef(new Animated.Value(0)).current;
  const sliderRef = useRef(null);
  const navigation = useNavigation();
  const firestore = getFirestore();

  // Fetch jewelry items from Firestore
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'jewelryItems'));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJewelryItems(items);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    };

    fetchItems();
  }, [firestore]);

  // Automatic slider movement
  useEffect(() => {
    const interval = setInterval(() => {
      sliderRef.current.scrollToOffset({
        offset: (scrollX._value + windowWidth) % (windowWidth * sliderImages.length),
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [scrollX]);

  // Filter jewelry items based on category
  const filterData = () => {
    if (selectedCategory === 'all') {
      return jewelryItems;
    }
    return jewelryItems.filter(item => item.category === selectedCategory);
  };

  // Render each slider item
  const renderSliderItem = ({ item }) => (
    <View style={styles.sliderItem}>
      <Image source={{ uri: item.uri }} style={styles.sliderImage} />
    </View>
  );

  // Render each jewelry item
  const renderJewelryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductScreen', { item })}
      style={styles.jewelryCard}
    >
      <Image source={{ uri: item.imageUri }} style={styles.jewelryImage} />
      <View style={styles.jewelryDetails}>
        <Text style={styles.jewelryName}>{item.name}</Text>
        <Text style={styles.jewelryPrice}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  // Open WhatsApp chat
  const openWhatsApp = () => {
    const phoneNumber = '+91 91044 65436';
    const url = `whatsapp://send?phone=${phoneNumber}`;
    Linking.openURL(url).catch(err => console.error('Error opening WhatsApp:', err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sliderContainer}>
        <Animated.FlatList
          ref={sliderRef}
          data={sliderImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderSliderItem}
          keyExtractor={(item, index) => index.toString()}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
        />
      </View>
      <Text style={styles.sectionTitle}>Featured Items</Text>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'necklace', 'bangle', 'earring'].map(category => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[styles.filterButton, selectedCategory === category && styles.filterButtonActive]}
            >
              <Text style={[styles.filterText, selectedCategory === category && styles.filterTextActive]}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={filterData()}
        renderItem={renderJewelryItem}
        keyExtractor={item => item.id}
        style={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />

      {/* WhatsApp Icon */}
      <TouchableOpacity style={styles.whatsappIcon} onPress={() => setModalVisible(true)}>
        <Image
          source={{ uri: 'https://t4.ftcdn.net/jpg/06/77/03/47/240_F_677034711_w7fGTbPxaGb1Nb1INqnmKXblsKGJlGTi.jpg' }}
          style={styles.whatsappImage} // Add a style for the image
        />
      </TouchableOpacity>

      {/* Modal for WhatsApp Connection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Connect with us!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={openWhatsApp}>
              <Text style={styles.modalButtonText}>Open WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5', // Light background color
  },
  sliderContainer: {
    height: 200,
    marginBottom: 20,
  },
  sliderItem: {
    width: windowWidth,
    height: '100%',
    position: 'relative',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  sectionTitle: {
    color: 'black', // Change to the desired color
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 15,
  },
  filterContainer: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E0E0E0', // Gray background
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#FF9999', // Change to the desired color
  },
  filterText: {
    color: '#000', // Default text color
  },
  filterTextActive: {
    color: '#FFF', // Active text color
  },
  list: {
    paddingHorizontal: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  jewelryCard: {
    width: '48%', // Two items per row
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  jewelryImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  jewelryDetails: {
    padding: 10,
  },
  jewelryName: {
    color: '#333', // Dark text for jewelry name
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  jewelryPrice: {
    color: '#FF9999', // Change price color to the desired color
    fontSize: 16,
    fontWeight: 'bold',
  },
  whatsappIcon: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: 'white',
    borderRadius: 25,
    elevation: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  whatsappImage: {
    width: 50, // Set the desired width
    height: 50, // Set the desired height
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    color: 'black',
  },
  modalButton: {
    backgroundColor: '#FF9999', // Change to the desired color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    paddingVertical: 10,
  },
  closeButtonText: {
    color: '#FF6666', // Change to the desired color
    fontSize: 16,
  },
});

export default HomeScreen;
