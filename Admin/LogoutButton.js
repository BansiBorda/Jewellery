// LogoutButton.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LogoutButton = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Handle logout logic here
    navigation.navigate('AdminLogin');
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>🚪</Text>
      <Text style={{ color: 'white' }}>Logout</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
