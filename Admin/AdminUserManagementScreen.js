// AdminUserManagementScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const AdminUserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')  // Ensure you have a 'users' collection in Firestore
      .onSnapshot((querySnapshot) => {
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching users: ", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const deleteUser = (userId) => {
    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => {
            firestore()
              .collection('users')
              .doc(userId)
              .delete()
              .then(() => {
                console.log("User deleted!");
              })
              .catch((error) => {
                console.error("Error deleting user: ", error);
              });
          }},
      ]
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userContainer}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteUser(item.id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <Text style={styles.loadingText}>Loading users...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Management</Text>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No users available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    elevation: 3,
  },
  userName: {
    color: '#FFD700',
    fontSize: 18,
  },
  userEmail: {
    color: '#A9A9A9',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#FFD700',
    textAlign: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default AdminUserManagementScreen;
