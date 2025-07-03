import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Button, TouchableOpacity } from 'react-native';
import api from '../services/api';
import { LineChart } from 'react-native-chart-kit';
import io from 'socket.io-client';
import { getUser } from '../utils/auth';

export default function DashboardScreen({ navigation }: any) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/payments/stats');
        setStats(res.data);
        console.log('Stats:', res.data);
      } catch (err: any) {
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();

    // Socket.io for real-time updates
    const socket = io('http://192.168.1.8:3000');
    socket.on('paymentCreated', () => {
      fetchStats();
      console.log('Payment created');
    });
    getUser().then(user => {
      setIsAdmin(user === 'admin');
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const chartData = stats?.last7Days
    ? {
        labels: stats.last7Days.map((d: any) => d.date.slice(5)),
        datasets: [
          {
            data: stats.last7Days.map((d: any) => d.revenue),
          },
        ],
      }
    : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : stats ? (
          <>
            <View style={styles.metricsRow}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Payments Today</Text>
                <Text style={styles.metricValue}>{stats.totalToday}</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Payments This Week</Text>
                <Text style={styles.metricValue}>{stats.totalWeek}</Text>
              </View>
            </View>
            <View style={styles.metricsRow}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Total Revenue</Text>
                <Text style={styles.metricValue}>${stats.totalRevenue}</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Failed Txns</Text>
                <Text style={[styles.metricValue, { color: '#ff3b30' }]}>{stats.failedCount}</Text>
              </View>
            </View>
            <Text style={styles.chartTitle}>Revenue (Last 7 Days)</Text>
            {chartData && (
              <LineChart
                data={chartData}
                width={Dimensions.get('window').width - 64}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Transactions')}>
                <Text style={styles.buttonText}>View Transactions</Text>
              </TouchableOpacity>
              {isAdmin && (
                <>
                  <View style={{ height: 7 }} />
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddPayment')}>
                    <Text style={styles.buttonText}>Add Payment</Text>
                  </TouchableOpacity>
                  <View style={{ height: 7 }} />
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserManagement')}>
                    <Text style={styles.buttonText}>User Management</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        ) : null}
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
  strokeWidth: 2,
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#007AFF',
  },
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding:17, backgroundColor: '#fff', minHeight: '100%' },
  title: { fontSize: 28, fontWeight: 'bold', marginVertical: 12, color: '#007AFF' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 12 },
  metricBox: { flex: 1, alignItems: 'center', marginHorizontal: 8, padding: 14, backgroundColor: '#f2f6fc', borderRadius: 10 },
  metricLabel: { fontSize: 14, color: '#555' },
  metricValue: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },
  chartTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 8 },
  chart: { borderRadius: 12 },
  error: { color: '#fff', backgroundColor: '#ff3b30', padding: 10, borderRadius: 6, marginBottom: 16, width: '100%', textAlign: 'center', fontWeight: 'bold' },
  buttonContainer: { marginTop: 24, width: '100%' },
  button: { width: '100%', backgroundColor: '#007AFF', padding: 11, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: '#b3d4fc' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
}); 