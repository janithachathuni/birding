import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Linking } from 'react-native';
import axios from 'axios';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://10.0.2.2:3001/api/auth/login', {
        email,
        password,
      });

      console.log('Response:', res.data);

      if (res.data && res.data.user) {
        const { role } = res.data.user;

        if (role === 'admin') {
          setIsAdmin(true);
        } else {
          navigation.replace('Home');
        }
      } else if (res.data === 'Success') {
        navigation.replace('Home');
      } else {
        Alert.alert('Invalid credentials', 'Please check your email or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login failed', 'Something went wrong. Please try again.');
    }
  };

  const openWebApp = () => {
    Linking.openURL('http://localhost:3000'); // 👈 replace with your actual web app URL
  };

  if (isAdmin) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 22, marginBottom: 20 }}>Welcome Admin!</Text>
        <Button title="OPEN WEB APP" onPress={openWebApp} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login Page</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 15,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 15,
          borderRadius: 5,
        }}
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
