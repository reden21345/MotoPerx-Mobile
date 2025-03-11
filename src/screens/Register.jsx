import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const Register = ({ navigation }) => {
    const { register } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        try {
            await register(name, email, password);
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Registration Failed', error);
        }
        setLoading(false);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Register</Text>

            <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderBottomWidth: 1, marginVertical: 10, padding: 10 }} />

            <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={{ borderBottomWidth: 1, marginVertical: 10, padding: 10 }} />

            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderBottomWidth: 1, marginVertical: 10, padding: 10 }} />
            
            <TouchableOpacity onPress={handleRegister} style={{ backgroundColor: '#007bff', padding: 15, borderRadius: 5, marginTop: 20 }}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', textAlign: 'center' }}>Register</Text>}
            </TouchableOpacity>
        </View>
    );
};

export default Register;