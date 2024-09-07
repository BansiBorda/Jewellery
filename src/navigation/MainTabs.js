// MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import LogoutScreen from '../screens/LogoutScreen'; 

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleLogout = () => {
    setModalVisible(true);
  };

  const confirmLogout = () => {
    // Implement logout logic here if needed
    navigation.navigate('Login'); // Navigate to Login screen
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const icon = {
          Home: '🏠',
          Cart: '🛒',
          Profile: '👤',
          Logout: '🚪',
        }[route.name];

        return route.name !== 'Logout' ? (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabButton}
          >
            <View style={[styles.iconContainer, isFocused && styles.iconContainerFocused]}>
              <Text style={[styles.iconText, isFocused && styles.iconTextFocused]}>{icon}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            key={index}
            onPress={handleLogout}
            style={styles.tabButton}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>{icon}</Text>
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

const MainTabs = () => (
  <Tab.Navigator
    tabBar={props => <CustomTabBar {...props} />}
    screenOptions={{
      tabBarShowLabel: false,
      headerShown: false,
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Cart" component={CartScreen} />
    <Tab.Screen name="Profile" component={UserProfileScreen} />
    <Tab.Screen name="Logout" component={LogoutScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'black',
    height: 70,
    alignItems: 'center',
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
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerFocused: {
    backgroundColor: 'gold',
  },
  iconText: {
    fontSize: 24,
    color: 'white',
  },
  iconTextFocused: {
    color: 'black', 
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
    color:'black'
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
