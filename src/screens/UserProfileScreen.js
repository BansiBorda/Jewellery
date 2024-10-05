import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';

const sliderImages = [
  { uri: 'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw3db19e7a/homepage/ShopByCollection/string-it.jpg' },
  { uri: 'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwb292158a/homepage/NewForYou/pretty-in-pink-new.jpg' },
  { uri: 'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw89ef1e4a/homepage/shopByCategory/diamond-necklace-set.jpg' },
];

const windowWidth = Dimensions.get('window').width;

// Sample current prices (replace with dynamic data if needed)
const currentPrices = [
  { item: 'Diamond (1 Carat)', price: '$4,000' },
  { item: '24-Carat Gold', price: '$1,800/oz' },
];

const HomeScreen = () => {
  const [jewelryItems, setJewelryItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const scrollX = useRef(new Animated.Value(0)).current;
  const sliderRef = useRef(null);
  const navigation = useNavigation();
  const firestore = getFirestore();

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

  useEffect(() => {
    const interval = setInterval(() => {
      sliderRef.current.scrollToOffset({
        offset: (scrollX._value + windowWidth) % (windowWidth * sliderImages.length),
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [scrollX]);

  const filterData = () => {
    if (selectedCategory === 'all') {
      return jewelryItems;
    }
    return jewelryItems.filter(item => item.category === selectedCategory);
  };

  const renderSliderItem = ({ item }) => (
    <View style={styles.sliderItem}>
      <Image source={{ uri: item.uri }} style={styles.sliderImage} />
    </View>
  );

  const renderJewelryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductScreen', { item })}
      style={styles.jewelryCard}
    >
      <Image source={{ uri: item.imageUri }} style={styles.jewelryImage} />
      <View style={styles.jewelryDetails}>
        <Text style={styles.jewelryName}>{item.name}</Text>
        <Text style={styles.jewelryPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleWhatsAppPress = () => {
    const phoneNumber = 'YOUR_PHONE_NUMBER'; // Replace with your WhatsApp number
    const message = 'Hello! I have a query regarding your jewelry.';
    const url = `whatsapp://send?text=${encodeURIComponent(message)}&phone=${phoneNumber}`;
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
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

      {/* Current Prices Section */}
      <View style={styles.currentPricesContainer}>
        <Text style={styles.sectionTitle}>Current Prices</Text>
        {currentPrices.map((item) => (
          <Text key={item.item} style={styles.priceText}>
            {item.item}: <Text style={styles.priceValue}>{item.price}</Text>
          </Text>
        ))}
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

      {/* WhatsApp Button */}
      <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsAppPress}>
        <Text style={styles.whatsappButtonText}>Chat with us on WhatsApp</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', // Clean white background
  },
  sliderContainer: {
    height: 220, // Height for the slider
    marginBottom: 20,
  },
  sliderItem: {
    width: windowWidth,
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  sectionTitle: {
    color: '#2A2A2A', // Dark color for titles
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
  },
  currentPricesContainer: {
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  priceText: {
    fontSize: 18,
    color: '#2A2A2A', // Dark color for price text
    marginBottom: 5,
  },
  priceValue: {
    fontWeight: 'bold', // Bold price value for emphasis
  },
  filterContainer: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2A2A2A', // Dark background for filter buttons
    borderRadius: 20,
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#C6A76B', // Active button color
  },
  filterText: {
    color: '#FFF', // Button text color
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: '#1A1A1A', // Active button text color
  },
  list: {
    flex: 1,
    paddingHorizontal: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  jewelryCard: {
    width: (windowWidth - 40) / 2,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFF', // Background color for jewelry cards
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
    resizeMode: 'cover',
  },
  jewelryDetails: {
    padding: 10,
  },
  jewelryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2A2A2A', // Dark color for jewelry names
  },
  jewelryPrice: {
    fontSize: 14,
    color: '#C6A76B', // Gold color for prices
  },
  whatsappButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#25D366', // WhatsApp green color
    borderRadius: 30,
    elevation: 5,
  },
  whatsappButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
