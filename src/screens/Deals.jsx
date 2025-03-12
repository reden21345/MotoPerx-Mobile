import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDeals } from '../redux/actions/dealsAction';

const Deals = () => {
    const dispatch = useDispatch();
    const { deals, loading, error } = useSelector((state) => state.deals);

    useEffect(() => {
        dispatch(getAllDeals());
    }, [dispatch]);

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
    }

    if (error) {
        Alert.alert('Error', error);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Available Deals</Text>
            <FlatList
                data={deals}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.dealCard}>
                        <Text style={styles.dealTitle}>{item.title}</Text>
                        <Text style={styles.dealDescription}>{item.description}</Text>
                        <Text style={styles.dealPoints}>Points Required: {item.redemptionPoints}</Text>
                        <TouchableOpacity style={styles.redeemButton}>
                            <Text style={styles.buttonText}>Redeem</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    dealCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    dealTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    dealDescription: {
        fontSize: 14,
        color: '#666',
        marginVertical: 5,
    },
    dealPoints: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 10,
    },
    redeemButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Deals;