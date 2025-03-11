import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const Login = ({ navigation }) => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await login(email, password);
            navigation.replace('Home'); 
        } catch (error) {
            Alert.alert('Login Failed', error);
        }
        setLoading(false);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Login</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={{ borderBottomWidth: 1, marginVertical: 10, padding: 10 }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ borderBottomWidth: 1, marginVertical: 10, padding: 10 }}
            />
            <TouchableOpacity
                onPress={handleLogin}
                style={{ backgroundColor: '#007bff', padding: 15, borderRadius: 5, marginTop: 20 }}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', textAlign: 'center' }}>Login</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={{ textAlign: 'center', marginTop: 20, color: '#007bff' }}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;