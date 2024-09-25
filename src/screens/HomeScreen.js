// HomeScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Dimensions, Text, TouchableOpacity, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';
import ProductScreen from './ProductScreen';

const sliderImages = [
  { uri: require('../../assets/images/neck.jpg') },
  { uri: require('../../assets/images/slider2.jpg') },
  { uri: require('../../assets/images/slider3.jpg') }
];

const windowWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const [jewelryItems, setJewelryItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDetail, setSelectedDetail] = useState('all');
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
    let filteredItems = jewelryItems;
    if (selectedCategory !== 'all') {
      filteredItems = filteredItems.filter(item => item.category === selectedCategory);
    }
    if (selectedDetail !== 'all') {
      filteredItems = filteredItems.filter(item => item.details === selectedDetail);
    }
    return filteredItems;
  };

  const renderSliderItem = ({ item }) => (
    <Image
      source={item.uri}
      style={styles.sliderImage}
    />
  );

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

  return (
    <View style={styles.container}>
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
        <View style={styles.filterRow}>
          <TouchableOpacity onPress={() => setSelectedCategory('all')} style={styles.filterButton}>
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedCategory('necklace')} style={styles.filterButton}>
            <Text style={styles.filterText}>Necklaces</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedCategory('bangle')} style={styles.filterButton}>
            <Text style={styles.filterText}>Bangles</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedCategory('earring')} style={styles.filterButton}>
            <Text style={styles.filterText}>Earrings</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={filterData()}
        renderItem={renderJewelryItem}
        keyExtractor={item => item.id}
        style={styles.list}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 20,
  },
  sliderContainer: {
    height: 200,
    marginBottom: 20,
  },
  sliderImage: {
    width: windowWidth - 40,
    height: '100%',
    resizeMode: 'cover',
    marginHorizontal: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    color: 'gold',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 10,
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#1c1c1c',
    borderRadius: 20,
  },
  filterText: {
    color: 'gold',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    padding: 5,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  jewelryCard: {
    width: (windowWidth - 60) / 3, // Adjust width to fit 3 items per row
    height: 160, // Fixed height
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#1c1c1c',
  },
  jewelryImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  jewelryDetails: {
    padding: 5,
  },
  jewelryName: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12, // Adjusted font size
  },
  jewelryPrice: {
    color: 'gold',
    textAlign: 'center',
    fontSize: 14, // Adjusted font size
  },
});

export default HomeScreen;
