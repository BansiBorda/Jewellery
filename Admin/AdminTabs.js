import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity } from 'react-native';
import AdminDashboardScreen from './AdminDashboard';
import FindOrdersScreen from './FindOrdersScreen';
import { useNavigation } from '@react-navigation/native';
import AdminUserManagementScreen from './AdminUserManagementScreen';
import LogoutScreen from '../src/screens/LogoutScreen';

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

const Tab = createBottomTabNavigator();

const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
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
        name="FindOrders"
        component={FindOrdersScreen}
        options={{
          title: 'Find Orders',
          tabBarIcon: () => <TabBarIcon label="🔍" />,
          tabBarLabel: 'Find Orders',
        }}
      />
      <Tab.Screen
        name="ManageUsers"
        component={AdminUserManagementScreen}
        options={{
          title: 'Manage Users',
          tabBarIcon: () => <TabBarIcon label="👥" />,// Example user management icon
          tabBarLabel: 'Manage Users',
        }}
      />
       <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          title: 'Logout',
          tabBarIcon: () => <TabBarIcon label="🚪" />, // Logout icon
          tabBarLabel: 'Logout',
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabs;
