import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const PartnerDashboard = () => {
    const dispatch = useDispatch();
    // const { badges, loading, error } = useSelector((state) => state.badges);

    // useEffect(() => {
    //     dispatch(getUserBadges());
    // }, [dispatch]);

    // if (loading) {
    //     return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
    // }

    // if (error) {
    //     Alert.alert('Error', error);
    // }

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Shop Dashboard</Text>

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
});

export default PartnerDashboard;