// AdminNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ManageJewelryScreen from '../../Admin/ManageJewelryScreen';
import AdminDashboard from '../../Admin/AdminDashboard';
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
        name="AdminDashboard" 
        component={AdminDashboard} 
        options={{ title: 'Admin Dashboard' }} 
      />
      <AdminStack.Screen 
        name="AdminLogin" 
        component={AdminLoginScreen} 
        options={{ title: 'Manage Jewelry' }} 
      />
    </AdminStack.Navigator>
  );
};

export default AdminNavigator;
