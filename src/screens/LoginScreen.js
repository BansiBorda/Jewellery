import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, SafeAreaView, ImageBackground } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const userDoc = await firestore().collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        console.log('User Data:', userDoc.data());
      } else {
        console.log('No such user data!');
      }

      navigation.replace('MainTabs');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://www.royaljewelry.com/public/link/website/images/social-bg-2.webp' }}  // Image URL
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Jewelry Heaven</Text>
        </View>
        <Text style={styles.subtitle}>Your one-stop destination for exquisite jewelry. Please login to continue.</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ddd"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ddd"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')}>
          <Text style={styles.link}>Admin Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20, // Added padding to avoid edge issues
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff', // White color for logo
    fontFamily: 'Georgia', // Change font family for logo
  },
  subtitle: {
    fontSize: 16,
    color: '#fff', // White color for subtitle
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Arial', // Change font family for subtitle
  },
  title: {
    fontSize: 28,
    color: '#fff', // White color for title
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
    fontFamily: 'Arial', // Change font family for title
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Lighter background for inputs
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc', // Subtle border color
  },
  input: {
    height: 55,
    color: '#333', // Dark color for input text
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF9999', // Use a color consistent with your product screen
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff', // White text for button
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorText: {
    color: '#FF6B6B',
    marginBottom: 15,
    textAlign: 'center',
  },
  link: {
    color: '#fff', // White color for link
    marginTop: 15,
    textAlign: 'center',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
