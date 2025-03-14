import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/actions/authAction';
import { getUserPoints } from '../redux/actions/pointsAction';
import { getQRCode } from '../redux/actions/qrcodeAction';
import QRCode from 'react-native-qrcode-svg';
// import QRCodeGenerator from 'react-native-qrcode-generator';

const Profile = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { qrCode } = useSelector((state) => state.qrCode);
    console.log(qrCode)
    // const { qrCode = {} } = useSelector((state) => state.qrCode);
    const { points, loading, error } = useSelector((state) => state.points);

    // ✅ Hooks should not be inside a conditional
    useEffect(() => {
        dispatch(getUserPoints());
        dispatch(getQRCode());
    }, [dispatch]);
    

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigation.replace('Login');
    };

    useEffect(() => {
        if (error) {
            Alert.alert('Error', error);
        }
    }, [error]); // ✅ Move alert inside useEffect

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={{ flex: 1, justifyContent: 'center' }} />
            ) : (
                <>
                    <Text style={styles.screenTitle}>Profile Screen</Text>
                    <Image 
                        source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
                        style={styles.profileImage} 
                    />
                    <Text style={styles.userName}>{user?.name}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    <Text style={styles.userRole}>Role: {user?.role}</Text>
                    <Text style={styles.userPoints}>Points: {points || 0}</Text>

                    {qrCode?.code && user?._id === qrCode?.user ? (
                        <QRCode key={qrCode.code} value={qrCode.code.toString()} size={150} />
                        // <QRCodeGenerator value={qrCode.code.toString()} size={150} />
                    ) : (
                        <Text>No QR Code available</Text>
                    )}


                    <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </>
            )}
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
    qrCodeImage: {
        width: 150,
        height: 150,
        marginVertical: 10,
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

export default Profile;