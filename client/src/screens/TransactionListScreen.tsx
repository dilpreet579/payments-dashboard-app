import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Platform, Linking, Button, Alert } from 'react-native';
import api from '../services/api';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getToken } from '../utils/auth';
import io from 'socket.io-client';

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

    // Socket.io for real-time updates
    const socket = io('http://192.168.1.8:3000');
    socket.on('paymentCreated', () => {
      // Only refresh if on first page and no filters for simplicity
      if (page === 1 && !status && !method && !startDate && !endDate) {
        fetchTransactions();
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [page, status, method, startDate, endDate]);

  const handleExport = async () => {
    console.log('Export button pressed');
    const params = [];
    if (status) params.push(`status=${encodeURIComponent(status)}`);
    if (method) params.push(`method=${encodeURIComponent(method)}`);
    if (startDate) params.push(`startDate=${startDate.toISOString().slice(0, 10)}`);
    if (endDate) params.push(`endDate=${endDate.toISOString().slice(0, 10)}`);
    const query = params.length ? `?${params.join('&')}` : '';
    const url = `/payments/export${query}`;
    try {
      if (Platform.OS === 'web') {
        console.log('Web export: importing file-saver');
        const { saveAs } = await import('file-saver');
        console.log('Web export: calling api.get', url);
        const res = await api.get(url, { responseType: 'blob' });
        console.log('Web export: got response, calling saveAs');
        saveAs(res.data, 'transactions.csv');
        console.log('Web export: saveAs called');
      } else {
        console.log('Mobile export: preparing download');
        const downloadUrl = `http://192.168.1.8:3000${url}`;
        const fileUri = FileSystem.documentDirectory + 'transactions.csv';
        const token = await getToken();
        console.log('Mobile export: downloading file', downloadUrl);
        const downloadRes = await FileSystem.downloadAsync(downloadUrl, fileUri, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Mobile export: file downloaded, sharing', downloadRes.uri);
        await Sharing.shareAsync(downloadRes.uri);
        Alert.alert('Exported', 'CSV exported and ready to share.');
      }
    } catch (err) {
      console.log('Export error:', err);
      Alert.alert('Export failed', 'Could not export transactions.');
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TransactionDetails', { transaction: item })}>
      <View style={styles.cardRow}>
        <Text style={styles.amount}>${item.amount}</Text>
        <View style={[styles.statusBadge, item.status === 'success' ? styles.success : item.status === 'failed' ? styles.failed : styles.pending]}>
          <Text style={styles.statusBadgeText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.receiver}>{item.receiver}</Text>
      <Text style={styles.method}>Method: {item.method}</Text>
      <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.bg}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Transactions</Text>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
        <TouchableOpacity style={styles.button} onPress={handleExport}>
          <Text style={styles.buttonText}>Export CSV</Text>
        </TouchableOpacity>
      </View>
      </View>
      
      <View style={styles.filtersCard}>
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
            <View style={{width: 10}} />
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
      </View>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No transactions found for the current filters.</Text>
            </View>
          ) : (
            <FlatList
              data={transactions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 24 }}
            />
          )}
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
  bg: { flex: 1, backgroundColor: '#f6f8fa', padding:17 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#007AFF', marginBottom: 8 },
  filtersCard: { backgroundColor: '#fff', borderRadius: 14, padding: 11, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  filters: {},
  filterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  filterLabel: { width: 80, fontSize: 14 },
  picker: { flex: 1, height: 53},
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 },
  dateInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, color: '#007AFF' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  amount: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignItems: 'center', justifyContent: 'center' },
  statusBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 13, textTransform: 'capitalize' },
  success: { backgroundColor: '#34c759' },
  failed: { backgroundColor: '#ff3b30' },
  pending: { backgroundColor: '#ff9500' },
  receiver: { fontSize: 16, marginTop: 2, marginBottom: 2 },
  method: { fontSize: 14, marginTop: 2, color: '#555' },
  date: { fontSize: 12, marginTop: 2, color: '#888' },
  error: { color: '#fff', backgroundColor: '#ff3b30', padding: 10, borderRadius: 6, marginBottom: 16, width: '100%', textAlign: 'center', fontWeight: 'bold' },
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  pageBtn: { marginHorizontal: 16, fontSize: 16, color: '#007AFF' },
  pageNum: { fontSize: 16 },
  disabled: { color: '#ccc' },
  emptyState: { alignItems: 'center', marginTop: 48, marginBottom: 24 },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyText: { fontSize: 16, color: '#888', textAlign: 'center' },
  button: { backgroundColor: '#007AFF', padding: 11, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
}); 