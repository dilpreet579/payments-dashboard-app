import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function TransactionListScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/payments', { params: { page, limit: 10 } });
        setTransactions(res.data.data);
        setTotalPages(res.data.pageCount);
      } catch (err: any) {
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [page]);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.amount}>${item.amount}</Text>
      <Text style={styles.receiver}>{item.receiver}</Text>
      <Text style={styles.status}>{item.status}</Text>
      <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
          <View style={styles.pagination}>
            <Text
              style={[styles.pageBtn, page === 1 && styles.disabled]}
              onPress={() => page > 1 && setPage(page - 1)}
            >
              Prev
            </Text>
            <Text style={styles.pageNum}>{page} / {totalPages}</Text>
            <Text
              style={[styles.pageBtn, page === totalPages && styles.disabled]}
              onPress={() => page < totalPages && setPage(page + 1)}
            >
              Next
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: { backgroundColor: '#f2f2f2', borderRadius: 8, padding: 16, marginBottom: 12 },
  amount: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  receiver: { fontSize: 16, marginTop: 4 },
  status: { fontSize: 14, marginTop: 2, color: '#555' },
  date: { fontSize: 12, marginTop: 2, color: '#888' },
  error: { color: 'red', marginBottom: 16, textAlign: 'center' },
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  pageBtn: { marginHorizontal: 16, fontSize: 16, color: '#007AFF' },
  pageNum: { fontSize: 16 },
  disabled: { color: '#ccc' },
}); 