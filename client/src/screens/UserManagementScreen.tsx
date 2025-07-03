import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

export default function UserManagementScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [adding, setAdding] = useState(false);
  const passwordInput = useRef<TextInput>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err: any) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!username || !password) {
      Alert.alert('Validation', 'Username and password are required.');
      return;
    }
    setAdding(true);
    try {
      await api.post('/users', { username, password, role });
      Alert.alert('Success', 'User added!');
      setUsername('');
      setPassword('');
      setRole('viewer');
      fetchUsers();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to add user');
    } finally {
      setAdding(false);
    }
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <Text style={styles.title}>User Management</Text>
        <Text style={styles.sectionTitle}>Add New User</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
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
          onSubmitEditing={handleAddUser}
        />
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={role} style={styles.picker} onValueChange={setRole}>
            <Picker.Item label="Viewer" value="viewer" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>
        <TouchableOpacity
          style={[styles.button, adding && styles.buttonDisabled]}
          onPress={handleAddUser}
          disabled={adding}
        >
          <Text style={styles.buttonText}>{adding ? 'Adding...' : 'Add User'}</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Users</Text>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <Text style={styles.userName}>{item.username}</Text>
                <Text style={styles.userRole}>{item.role}</Text>
                <Text style={styles.userDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f8fa', minHeight: '100%' },
  card: { width: '95%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 16, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, marginTop: 32, marginBottom: 32 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 18, color: '#007AFF' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 18, marginBottom: 8, color: '#555', alignSelf: 'flex-start' },
  input: { width: '100%', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 16, backgroundColor: '#f9f9f9' },
  pickerWrapper: { width: '100%', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, marginBottom: 16, backgroundColor: '#f9f9f9' },
  picker: { width: '100%', height: 53 },
  button: { width: '100%', backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: '#b3d4fc' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  error: { color: '#fff', backgroundColor: '#ff3b30', padding: 10, borderRadius: 6, marginBottom: 16, width: '100%', textAlign: 'center', fontWeight: 'bold' },
  userCard: { width: '100%', backgroundColor: '#f2f6fc', borderRadius: 8, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  userRole: { fontSize: 14, color: '#555', fontWeight: 'bold' },
  userDate: { fontSize: 12, color: '#888' },
}); 