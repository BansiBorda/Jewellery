// AppNavigator.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabs from './MainTabs';
import AdminLoginScreen from '../../Admin/AdminLoginScreen'; // Admin login screen
import AdminNavigator from './AdminNavigator'; // Import the AdminNavigator
import JewelryCard from '../components/JewelryCard'; // Import JewelryCard

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Track admin login

  useEffect(() => {
    // Simulate checking the user's authentication status
    const checkAuthStatus = async () => {
      setTimeout(() => {
        setIsAuthenticated(false); // Set to `true` for authenticated users
      }, 1000);
    };
    checkAuthStatus();
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'black',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: 'gold',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerBackTitleVisible: false,
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="AdminLogin">
              {(props) => <AdminLoginScreen {...props} setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />}
            </Stack.Screen>
          </>
        ) : isAdmin ? (
          <Stack.Screen name="Admin" component={AdminNavigator} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="JewelryCard" component={JewelryCard} options={{ title: 'Jewelry Details' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: 'gold',
  },
});

export default AppNavigator;
