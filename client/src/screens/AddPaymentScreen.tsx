import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../services/api';
import { Picker } from '@react-native-picker/picker';

export default function AddPaymentScreen({ navigation }: any) {
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [status, setStatus] = useState('success');
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount || !receiver) {
      Alert.alert('Validation', 'Amount and receiver are required.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/payments', {
        amount: parseFloat(amount),
        receiver,
        status,
        method,
      });
      Alert.alert('Success', 'Payment added!', [
        { text: 'OK', onPress: () => navigation.navigate('Transactions') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Payment</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Receiver"
        value={receiver}
        onChangeText={setReceiver}
      />
      <Text style={styles.label}>Status:</Text>
      <Picker selectedValue={status} style={styles.picker} onValueChange={setStatus}>
        <Picker.Item label="Success" value="success" />
        <Picker.Item label="Failed" value="failed" />
        <Picker.Item label="Pending" value="pending" />
      </Picker>
      <Text style={styles.label}>Method:</Text>
      <Picker selectedValue={method} style={styles.picker} onValueChange={setMethod}>
        <Picker.Item label="Card" value="card" />
        <Picker.Item label="UPI" value="upi" />
        <Picker.Item label="Netbanking" value="netbanking" />
        <Picker.Item label="Cash" value="cash" />
      </Picker>
      <Button title={loading ? 'Adding...' : 'Add Payment'} onPress={handleSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 16 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  picker: { marginBottom: 16 },
}); 