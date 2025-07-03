import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Platform } from 'react-native';
import api from '../services/api';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TransactionListScreen({ navigation }: any) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError('');
      try {
        const params: any = { page, limit: 10 };
        if (status) params.status = status;
        if (method) params.method = method;
        if (startDate) params.startDate = startDate.toISOString().slice(0, 10);
        if (endDate) params.endDate = endDate.toISOString().slice(0, 10);
        const res = await api.get('/payments', { params });
        setTransactions(res.data.data);
        setTotalPages(res.data.pageCount);
      } catch (err: any) {
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [page, status, method, startDate, endDate]);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TransactionDetails', { transaction: item })}>
      <Text style={styles.amount}>${item.amount}</Text>
      <Text style={styles.receiver}>{item.receiver}</Text>
      <Text style={styles.method}>Method: {item.method}</Text>
      <Text style={styles.status}>{item.status}</Text>
      <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>
      <View style={styles.filters}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Status:</Text>
          <Picker
            selectedValue={status}
            style={styles.picker}
            onValueChange={(v) => setStatus(v)}
          >
            <Picker.Item label="All" value="" />
            <Picker.Item label="Success" value="success" />
            <Picker.Item label="Failed" value="failed" />
            <Picker.Item label="Pending" value="pending" />
          </Picker>
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Method:</Text>
          <Picker
            selectedValue={method}
            style={styles.picker}
            onValueChange={(v) => setMethod(v)}
          >
            <Picker.Item label="All" value="" />
            <Picker.Item label="Card" value="card" />
            <Picker.Item label="UPI" value="upi" />
            <Picker.Item label="Netbanking" value="netbanking" />
            <Picker.Item label="Cash" value="cash" />
          </Picker>
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Start Date:</Text>
          <Text style={styles.dateInput} onPress={() => setShowStartPicker(true)}>
            {startDate ? startDate.toISOString().slice(0, 10) : 'Select'}
          </Text>
          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, date) => {
                setShowStartPicker(false);
                if (date) setStartDate(date);
              }}
            />
          )}
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>End Date:</Text>
          <Text style={styles.dateInput} onPress={() => setShowEndPicker(true)}>
            {endDate ? endDate.toISOString().slice(0, 10) : 'Select'}
          </Text>
          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, date) => {
                setShowEndPicker(false);
                if (date) setEndDate(date);
              }}
            />
          )}
        </View>
      </View>
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
  filters: { marginBottom: 16 },
  filterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  filterLabel: { width: 80, fontSize: 14 },
  picker: { flex: 1, height: 40 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 },
  dateInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, color: '#007AFF' },
  card: { backgroundColor: '#f2f2f2', borderRadius: 8, padding: 16, marginBottom: 12 },
  amount: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  receiver: { fontSize: 16, marginTop: 4 },
  method: { fontSize: 14, marginTop: 2, color: '#555' },
  status: { fontSize: 14, marginTop: 2, color: '#555' },
  date: { fontSize: 12, marginTop: 2, color: '#888' },
  error: { color: 'red', marginBottom: 16, textAlign: 'center' },
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  pageBtn: { marginHorizontal: 16, fontSize: 16, color: '#007AFF' },
  pageNum: { fontSize: 16 },
  disabled: { color: '#ccc' },
}); 