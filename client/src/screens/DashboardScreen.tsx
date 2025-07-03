import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Button } from 'react-native';
import api from '../services/api';
import { LineChart } from 'react-native-chart-kit';

export default function DashboardScreen({ navigation }: any) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
              <Text style={styles.metricValue}>{stats.failedCount}</Text>
            </View>
          </View>
          <Text style={styles.chartTitle}>Revenue (Last 7 Days)</Text>
          {chartData && (
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 32}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
          <View style={styles.buttonContainer}>
            <Button title="View Transactions" onPress={() => navigation.navigate('Transactions')} />
            <View style={{ height: 12 }} />
            <Button title="Add Payment" onPress={() => navigation.navigate('AddPayment')} />
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
  container: { flexGrow: 1, alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginVertical: 16 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 16 },
  metricBox: { flex: 1, alignItems: 'center', marginHorizontal: 8, padding: 12, backgroundColor: '#f2f2f2', borderRadius: 8 },
  metricLabel: { fontSize: 14, color: '#555' },
  metricValue: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },
  chartTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 8 },
  chart: { borderRadius: 12 },
  error: { color: 'red', marginBottom: 16 },
  buttonContainer: { marginTop: 24, width: '100%' },
}); 