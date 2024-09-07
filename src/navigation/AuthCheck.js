import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from  '@react-native-firebase/auth';

const AuthCheck = () => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setLoading(false);
      if (user) {
        navigation.navigate('UserProfileScreen');
      } else {
        navigation.navigate('LoginScreen');
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  if (loading) {
    return <ActivityIndicator size="large" color="gold" style={styles.loading} />;
  }

  return null;
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
});

export default AuthCheck;
