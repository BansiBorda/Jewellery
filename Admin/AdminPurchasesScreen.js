import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';

const AdminPurchaseHistoryScreen = () => {
    const [usersPurchases, setUsersPurchases] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading indicator
    const firestore = getFirestore();

    useEffect(() => {
        const fetchUsersPurchases = async () => {
            setLoading(true); // Set loading to true when starting to fetch data
            try {
                const usersRef = collection(firestore, 'users');
                const usersSnapshot = await getDocs(usersRef);

                const purchasesData = [];

                for (const userDoc of usersSnapshot.docs) {
                    const userId = userDoc.id;
                    const userData = userDoc.data();
                    
                    // Get the user's email address
                    const userEmail = userData.email || 'No email provided';
                    
                    const purchaseRef = collection(firestore, 'users', userId, 'purchaseItems');
                    const purchaseSnapshot = await getDocs(purchaseRef);

                    const purchases = purchaseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    if (purchases.length > 0) {
                        purchasesData.push({
                            userId,
                            userEmail,
                            purchases,
                        });
                    }
                }

                setUsersPurchases(purchasesData);
            } catch (error) {
                console.error('Failed to fetch user purchases:', error);
            } finally {
                setLoading(false); // Set loading to false after data fetching is done
            }
        };

        fetchUsersPurchases();
    }, [firestore]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6666" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Admin Purchase Overview</Text>
            {usersPurchases.length === 0 ? (
                <Text style={styles.emptyMessage}>No purchase data available.</Text>
            ) : (
                usersPurchases.map((userData, index) => (
                    <View key={index} style={styles.userContainer}>
                        <Text style={styles.userId}>User ID: {userData.userId}</Text>
                        <Text style={styles.userEmail}>Email: {userData.userEmail}</Text>
                        {userData.purchases.map((purchase) => (
                            <View key={purchase.id} style={styles.purchaseItem}>
                                <Image source={{ uri: purchase.imageUri }} style={styles.productImage} />
                                <View style={styles.purchaseDetails}>
                                    <Text style={styles.purchaseName}>{purchase.name}</Text>
                                    <Text style={styles.purchasePrice}>Price: €{purchase.price}</Text>
                                    <Text style={styles.purchaseQuantity}>Quantity: {purchase.quantity}</Text>
                                    <Text style={styles.purchaseStatus}>
                                        Status: <Text style={styles.completedStatus}>Completed</Text>
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    emptyMessage: {
        fontSize: 18,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
    userContainer: {
        marginBottom: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    userId: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    userEmail: {
        fontSize: 16,
        marginBottom: 10,
        color: '#666',
    },
    purchaseItem: {
        flexDirection: 'row',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 5,
        marginRight: 10,
    },
    purchaseDetails: {
        flex: 1,
    },
    purchaseName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    purchasePrice: {
        fontSize: 16,
        color: '#FF6666',
    },
    purchaseQuantity: {
        fontSize: 16,
        color: '#666',
    },
    purchaseStatus: {
        fontSize: 16,
        color: '#333',
    },
    completedStatus: {
        fontWeight: 'bold',
        color: '#28a745', // Green color for completed status
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },
});

export default AdminPurchaseHistoryScreen;
