import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function TransactionDetailsScreen({ route, navigation }: any) {
  const { transaction } = route.params || {};

  if (!transaction) {
    return (
      <View style={styles.bg}>
        <View style={styles.card}>
          <Text style={styles.error}>No transaction data found.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <Text style={styles.title}>Transaction Details</Text>
        <View style={styles.row}><Text style={styles.label}>Amount:</Text><Text style={styles.value}>${transaction.amount}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Receiver:</Text><Text style={styles.value}>{transaction.receiver}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Method:</Text><Text style={styles.value}>{transaction.method}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Status:</Text><Text style={[styles.value, transaction.status === 'success' ? styles.success : transaction.status === 'failed' ? styles.failed : styles.pending]}>{transaction.status}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Date:</Text><Text style={styles.value}>{new Date(transaction.createdAt).toLocaleString()}</Text></View>
        <View style={styles.row}><Text style={styles.label}>User ID:</Text><Text style={styles.value}>{transaction.userId}</Text></View>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#f6f8fa', justifyContent: 'center', alignItems: 'center', padding: 17 },
  card: { width: '95%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 16, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 18, color: '#007AFF' },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#555' },
  value: { fontSize: 16, color: '#007AFF', fontWeight: 'bold' },
  success: { color: '#34c759' },
  failed: { color: '#ff3b30' },
  pending: { color: '#ff9500' },
  error: { color: '#fff', backgroundColor: '#ff3b30', padding: 10, borderRadius: 6, marginBottom: 16, width: '100%', textAlign: 'center', fontWeight: 'bold' },
  backBtn: { marginTop: 18, backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
}); 