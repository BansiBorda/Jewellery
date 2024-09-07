import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const UserProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userEmail = currentUser.email;
          setEmail(userEmail); // Set the email from Firebase Authentication
          
          const userDoc = await firestore().collection('users').doc(userEmail).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setName(userData.name || '');
            setProfileImage(userData.profileImage || '');
          } else {
            setError('User not found');
          }
        } else {
          setError('No user is logged in');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!name || !email) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const userEmail = currentUser.email;
        await firestore().collection('users').doc(userEmail).update({
          name,
          email,
        });
        console.log('Profile Updated:', { name, email });
      } else {
        setError('No user is logged in');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="gold" style={styles.loading} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: profileImage || 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#ddd"
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#ddd"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={false} // Make email field read-only
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: '#444',
  },
  username: {
    color: 'gold',
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    color: '#ccc',
    fontSize: 18,
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    width: '100%',
  },
  label: {
    color: 'gold',
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: 'gold',
    borderBottomWidth: 2,
    marginBottom: 20,
    color: '#fff',
    width: '100%',
    paddingHorizontal: 15,
    fontSize: 18,
  },
  button: {
    backgroundColor: 'gold',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
});

export default UserProfileScreen;
