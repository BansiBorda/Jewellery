// AdminNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AdminTabs from '../../Admin/AdminTabs';
import AdminLoginScreen from '../../Admin/AdminLoginScreen';

const AdminStack = createStackNavigator();

const AdminNavigator = ({ navigation }) => {
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
          title: 'Admin Login',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login'); // Navigate to the user login screen
              }}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>←</Text> {/* Back Arrow using Text */}
            </TouchableOpacity>
          ),
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
    color: 'gold', // Gold color for the text
    fontSize: 18, // Adjust the font size as needed
    fontWeight: 'bold', // Bold text for better visibility
  },
});

export default AdminNavigator;
