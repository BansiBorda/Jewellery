// AdminTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity } from 'react-native';
import AdminDashboardScreen from './AdminDashboard';
import AdminUserManagementScreen from './AdminUserManagementScreen';
import LogoutScreen from '../src/screens/LogoutScreen';
import AdminCartScreen from './AdminCartScreen';
import AdminPurchaseHistoryScreen from './AdminPurchasesScreen'; // Import the new screen
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

// Helper component for custom tab bar icon
const TabBarIcon = ({ label }) => (
  <View style={{ alignItems: 'center' }}>
    <Text style={{ fontSize: 20 }}>{label}</Text>
  </View>
);

// Custom Logout Button
const LogoutButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
      }}
      onPress={() => navigation.navigate('AdminLogin')}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
    </TouchableOpacity>
  );
};

const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        // headerShown: false,
        tabBarActiveTintColor: 'gold',
        tabBarStyle: { backgroundColor: 'black' },
        tabBarLabelStyle: { color: 'white', fontSize: 14 },
      }}
    >
      <Tab.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: () => <TabBarIcon label="📊" />,
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="AdminCart"
        component={AdminCartScreen}
        options={{
          title: 'Find Orders',
          tabBarIcon: () => <TabBarIcon label="🔍" />,
          tabBarLabel: 'Find Orders',
        }}
      />
      <Tab.Screen
        name="AdminPurchaseHistory"
        component={AdminPurchaseHistoryScreen}
        options={{
          title: 'Purchase History',
          tabBarIcon: () => <TabBarIcon label="📜" />,
          tabBarLabel: 'Purchase History',
        }}
      />

    </Tab.Navigator>
  );
};

export default AdminTabs;
