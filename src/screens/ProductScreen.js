import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

const ProductScreen = ({ route, navigation }) => {
    const { item } = route.params;

    return (
        <View style={styles.container}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Button title="Add to Cart" onPress={() => navigation.navigate('Cart', { item })} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    name: {
        color: '#FFD700',
        fontSize: 24,
        marginBottom: 10,
    },
    price: {
        color: '#FFD700',
        fontSize: 20,
        marginBottom: 20,
    },
});

export default ProductScreen;
