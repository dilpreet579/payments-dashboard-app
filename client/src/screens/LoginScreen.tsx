import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, TouchableOpacity, Image } from 'react-native';
import api from '../services/api';
import { saveToken, saveUser } from '../utils/auth';

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const passwordInput = useRef<TextInput>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Login button pressed');
      console.log('Logging in...');
      const res = await api.post('/auth/login', { username, password });
      console.log('Login response:', res.data);
      await saveToken(res.data.access_token);
      await saveUser(res.data.user.role);
      navigation.replace('Dashboard');
    } catch (err: any) {
      let message = 'Login failed. Please try again.';
      if (err?.response?.status === 401) {
        message = 'Invalid credentials. Please check your username and password.';
      } else if (err?.response?.data?.message) {
        message = err.response.data.message;
      }
      setError(message);
      Alert.alert('Login failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Sign In</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          returnKeyType="next"
          onSubmitEditing={() => passwordInput.current?.focus()}
          blurOnSubmit={false}
        />
        <TextInput
          ref={passwordInput}
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#f6f8fa', justifyContent: 'center', alignItems: 'center' },
  card: { width: '90%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  logo: { width: 60, height: 60, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#007AFF' },
  input: { width: '100%', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 16, backgroundColor: '#f9f9f9' },
  button: { width: '100%', backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: '#b3d4fc' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  error: { color: '#fff', backgroundColor: '#ff3b30', padding: 10, borderRadius: 6, marginBottom: 16, width: '100%', textAlign: 'center', fontWeight: 'bold' },
}); 