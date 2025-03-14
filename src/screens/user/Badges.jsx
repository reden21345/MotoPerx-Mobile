import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBadges } from '../../redux/actions/badgesAction';

const Badges = () => {
    const dispatch = useDispatch();
    const { badges, loading, error } = useSelector((state) => state.badges);

    useEffect(() => {
        dispatch(getUserBadges());
    }, [dispatch]);

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
    }

    if (error) {
        Alert.alert('Error', error);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>My Badges</Text>
            <FlatList
                data={badges}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.badgeCard}>
                        {/* <Image source={{ uri: item.image }} style={styles.badgeImage} /> */}
                        <Text style={styles.badgeTitle}>{item.name}</Text>
                        <Text style={styles.badgeDescription}>{item.description}</Text>
                        <Text style={styles.badgeEarnedAt}>Earned At: {new Date(item.earnedAt).toLocaleDateString()}</Text>
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
    badgeCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    },
    badgeImage: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    badgeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    badgeDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});

export default Badges;