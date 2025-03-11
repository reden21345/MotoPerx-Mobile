import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/actions/authAction';

const RegisterScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        const result = await dispatch(registerUser({ name, email, password }));
        if (registerUser.fulfilled.match(result)) {
            navigation.replace('Home'); 
        } else {
            Alert.alert('Registration Failed', result.payload || 'Something went wrong');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Register</Text>

            {error && <Text style={{ color: 'red', textAlign: 'center' }}>{String(error)}</Text>}

            <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderBottomWidth: 1, marginVertical: 10, padding: 10 }} />

            <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={{ borderBottomWidth: 1, marginVertical: 10, padding: 10 }} />

            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderBottomWidth: 1, marginVertical: 10, padding: 10 }} />
            
            <TouchableOpacity onPress={handleRegister} style={{ backgroundColor: '#007bff', padding: 15, borderRadius: 5, marginTop: 20 }}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', textAlign: 'center' }}>Register</Text>}
            </TouchableOpacity>
        </View>
    );
};

export default RegisterScreen;