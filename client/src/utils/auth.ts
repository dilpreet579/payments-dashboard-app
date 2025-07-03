import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = 'jwt';
const USER_KEY = 'user';

export async function saveToken(token: string) {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function getToken() {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(TOKEN_KEY);
  } else {
    return SecureStore.getItemAsync(TOKEN_KEY);
  }
}

export async function removeToken() {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export async function saveUser(user:string) {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(USER_KEY, user);
  } else {
    await SecureStore.setItemAsync(USER_KEY, user);
  }
}

export async function getUser() {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(USER_KEY);
  } else {
    return SecureStore.getItemAsync(USER_KEY);
  }
}

export async function removeUser() {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(USER_KEY);
  } else {
    await SecureStore.deleteItemAsync(USER_KEY);
  }
} 