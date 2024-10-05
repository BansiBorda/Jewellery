import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  SafeAreaView, 
  ImageBackground, 
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native';

const AdminLoginScreen = ({ navigation, setIsAuthenticated, setIsAdmin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate=useNavigation()

  const handleLogin = () => {
    if (email === 'admin@gmail.com' && password === '123') {
      setIsAuthenticated(true);
      setIsAdmin(true);
      
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://www.royaljewelry.com/public/link/website/images/social-bg-2.webp' }}  // Image URL
      style={styles.backgroundImage}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Admin Portal</Text>
          </View>
          <Text style={styles.subtitle}>Please log in to access the admin features.</Text>
          <Text style={styles.title}>Welcome Back</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#A9A9A9" // Grey for placeholder text
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#A9A9A9" // Grey for placeholder text
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>User Login</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableWithoutFeedback>
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
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF9AAB', // Use your specified color for logo
    fontFamily: 'Georgia', // Classic font
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
    borderColor: '#FF9AAB', // Light pink border
  },
  input: {
    height: 55,
    color: '#333', // Dark color for input text
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF9AAB', // Use the specified color
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
    color: '#FF6B6B', // Red for error messages
    marginBottom: 15,
    textAlign: 'center',
  },
  link: {
    color: 'white', // Light pink for link
    marginTop: 15,
    textAlign: 'center',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default AdminLoginScreen;
