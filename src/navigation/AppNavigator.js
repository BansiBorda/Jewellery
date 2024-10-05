import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabs from './MainTabs';
import AdminLoginScreen from '../../Admin/AdminLoginScreen';
import AdminNavigator from './AdminNavigator';
import ProductScreen from '../screens/ProductScreen';
import CartScreen from '../screens/CartScreen';
import OrderScreen from '../screens/OrdersScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Simulate authentication check
      setTimeout(() => {
        setIsAuthenticated(false);
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
            backgroundColor: '#FF9999', // Header background color
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: 'white', // Header text color
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
              {props => (
                <LoginScreen
                  {...props}
                  setIsAuthenticated={setIsAuthenticated}
                  setUserEmail={setUserEmail}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {props => (
                <RegisterScreen
                  {...props}
                  setIsAuthenticated={setIsAuthenticated}
                  setUserEmail={setUserEmail}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="AdminLogin">
              {props => (
                <AdminLoginScreen
                  {...props}
                  setIsAuthenticated={setIsAuthenticated}
                  setIsAdmin={setIsAdmin}
                />
              )}
            </Stack.Screen>
          </>
        ) : isAdmin ? (
          <Stack.Screen
            name="AdminNavigator"
            component={AdminNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={MainTabs}
              initialParams={{ email: userEmail }}
            />
            <Stack.Screen
              name="ProductScreen"
              component={ProductScreen}
              options={{ title: 'Jewelry Details' }}
            />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="OrderScreen" component={OrderScreen} />
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
    color: '#FF9999', // Loading text color to soft pink
  },
});

export default AppNavigator;
