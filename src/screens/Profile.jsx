import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/actions/authAction';
import { getUserPoints } from '../redux/actions/pointsAction';

const ProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { points, loading, error } = useSelector((state) => state.points);

    useEffect(() => {
        dispatch(getUserPoints());
    }, [dispatch]);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigation.replace('Login');
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    if (error) {
        Alert.alert('Error', error);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Profile Screen</Text>
            <Image 
                source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
                style={styles.profileImage} 
            />
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userRole}>Role: {user?.role}</Text>
            <Text style={styles.userPoints}>Points: {points || 0}</Text>
            
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#007bff',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    userEmail: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    userRole: {
        fontSize: 16,
        color: '#444',
        marginBottom: 5,
    },
    userPoints: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        marginTop: 15,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
    },
});

export default ProfileScreen;