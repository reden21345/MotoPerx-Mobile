import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const Home = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);
    console.log("User: ", user)

    const handleLogout = async () => {
        await logout();
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Image 
                style={styles.profileImage} 
            />
            <Text style={styles.userName}>{user?.profile.name}</Text>
            <Text style={styles.userEmail}>{user?.profile.email}</Text>
            
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Deals')}>
                <Text style={styles.buttonText}>View Deals</Text>
            </TouchableOpacity>
            
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

export default Home;