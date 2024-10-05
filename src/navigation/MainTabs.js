import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import auth from '@react-native-firebase/auth';

import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import ProductScreen from '../screens/ProductScreen';
import OrderScreen from '../screens/OrdersScreen';
import WishlistScreen from '../screens/WishlistScreen';
import LoginScreen from '../screens/LoginScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProductStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#FF9999' }, // Main soft pink for headers
      headerTintColor: 'white',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ProductScreen" component={ProductScreen} />
    <Stack.Screen name="OrderScreen" component={OrderScreen} />
  </Stack.Navigator>
);

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleLogout = () => {
    setModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await auth().signOut(); // Sign out the user from Firebase
      navigation.navigate('Login'); // Navigate to Login screen
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  // Replace these URLs with your actual image URLs
  const iconUrls = {
    Home: 'https://em-content.zobj.net/source/apple/271/house_1f3e0.png',
    Cart: 'https://em-content.zobj.net/source/apple/81/shopping-trolley_1f6d2.png',
    Wishlist: 'https://www.clipartmax.com/png/full/296-2961300_heart-love-red-whatsapp-emoji-emotion-emotions-big-heart-emoji.png',
    Logout: 'https://icons.iconarchive.com/icons/custom-icon-design/pretty-office-6/128/logout-icon.png',
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const iconUrl = iconUrls[route.name];

        return (
          <TouchableOpacity
            key={index}
            onPress={route.name === 'Logout' ? handleLogout : () => navigation.navigate(route.name)}
            style={styles.tabButton}
          >
            <View style={[styles.iconContainer, isFocused && styles.iconContainerFocused]}>
              <Image source={{ uri: iconUrl }} style={[styles.iconImage, isFocused && styles.iconImageFocused]} />
            </View>
          </TouchableOpacity>
        );
      })}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={ProductStack} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Logout" component={LoginScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFB2C1', // Light pink background for the tab bar
    height: 70,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#FF9999', // Soft pink border for the tab bar
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF9999', // Soft pink for focused icons
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerFocused: {
    backgroundColor: '#FFB2C1', // Light pink for focused icons
  },
  iconImage: {
    width: 30,
    height: 30, // Adjust the size of the image as needed
    resizeMode: 'contain',
  },
  iconImageFocused: {
    // Styles for focused image (if different from normal)
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: 'red',
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MainTabs;
