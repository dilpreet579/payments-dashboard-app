import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function TransactionDetailsScreen({ route, navigation }: any) {
  const { transaction } = route.params || {};

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No transaction data found.</Text>
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction Details</Text>
      <Text style={styles.label}>Amount:</Text>
      <Text style={styles.value}>${transaction.amount}</Text>
      <Text style={styles.label}>Receiver:</Text>
      <Text style={styles.value}>{transaction.receiver}</Text>
      <Text style={styles.label}>Method:</Text>
      <Text style={styles.value}>{transaction.method}</Text>
      <Text style={styles.label}>Status:</Text>
      <Text style={styles.value}>{transaction.status}</Text>
      <Text style={styles.label}>Date:</Text>
      <Text style={styles.value}>{new Date(transaction.createdAt).toLocaleString()}</Text>
      <Text style={styles.label}>User ID:</Text>
      <Text style={styles.value}>{transaction.userId}</Text>
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  value: { fontSize: 16, marginTop: 2, color: '#007AFF' },
  error: { color: 'red', fontSize: 16, textAlign: 'center', marginBottom: 16 },
}); 