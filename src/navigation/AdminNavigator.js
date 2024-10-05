import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import AdminTabs from '../../Admin/AdminTabs';
import AdminLoginScreen from '../../Admin/AdminLoginScreen';

const AdminStack = createStackNavigator();



const AdminNavigator = () => {
  return (
    <AdminStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: 'gold',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <AdminStack.Screen
        name="AdminTabs"
        component={AdminTabs}
        options={{ headerShown: false }}
      />
      <AdminStack.Screen
        name="AdminLogin"
        component={AdminLoginScreen}
        options={{
        }}
      />
    </AdminStack.Navigator>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: 'gold',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminNavigator;
