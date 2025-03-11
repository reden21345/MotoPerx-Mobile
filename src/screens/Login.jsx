import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/actions/authAction';

const Login = ({ navigation }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const result = await dispatch(loginUser({ email, password }));

        if (loginUser.fulfilled.match(result)) {
            navigation.replace('Home'); 
        } else {
            Alert.alert('Login Failed', result.payload);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Login</Text>
            {error && <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>}
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