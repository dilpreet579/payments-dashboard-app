import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TransactionListScreen from './src/screens/TransactionListScreen';
import TransactionDetailsScreen from './src/screens/TransactionDetailsScreen';
import AddPaymentScreen from './src/screens/AddPaymentScreen';
import UserManagementScreen from './src/screens/UserManagementScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Transactions" component={TransactionListScreen} />
        <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
        <Stack.Screen name="AddPayment" component={AddPaymentScreen} />
        <Stack.Screen name="UserManagement" component={UserManagementScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
