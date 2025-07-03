import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';
import api from '../services/api';
import { Picker } from '@react-native-picker/picker';

export default function AddPaymentScreen({ navigation }: any) {
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [status, setStatus] = useState('success');
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const receiverInput = useRef<TextInput>(null);

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
    <ScrollView contentContainerStyle={styles.bg} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Image source={require('../../assets/addPayment.png')} style={styles.icon} />
        <Text style={styles.title}>Add Payment</Text>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          returnKeyType="next"
          onSubmitEditing={() => receiverInput.current?.focus()}
          blurOnSubmit={false}
        />
        <TextInput
          ref={receiverInput}
          style={styles.input}
          placeholder="Receiver"
          value={receiver}
          onChangeText={setReceiver}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
        <Text style={styles.label}>Status:</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={status} style={styles.picker} onValueChange={setStatus}>
            <Picker.Item label="Success" value="success" />
            <Picker.Item label="Failed" value="failed" />
            <Picker.Item label="Pending" value="pending" />
          </Picker>
        </View>
        <Text style={styles.label}>Method:</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={method} style={styles.picker} onValueChange={setMethod}>
            <Picker.Item label="Card" value="card" />
            <Picker.Item label="UPI" value="upi" />
            <Picker.Item label="Netbanking" value="netbanking" />
            <Picker.Item label="Cash" value="cash" />
          </Picker>
        </View>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Adding...' : 'Add Payment'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f8fa', minHeight: '100%' },
  card: { width: '95%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 16, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, marginTop: 32, marginBottom: 32 },
  icon: { width: 48, height: 48, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 18, color: '#007AFF' },
  input: { width: '100%', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 16, backgroundColor: '#f9f9f9' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 12, alignSelf: 'flex-start', color: '#555' },
  pickerWrapper: { width: '100%', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, marginBottom: 16, backgroundColor: '#f9f9f9' },
  picker: { width: '100%', height: 53 },
  button: { width: '100%', backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: '#b3d4fc' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
}); 