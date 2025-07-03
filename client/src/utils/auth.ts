import * as SecureStore from 'expo-secure-store';

export async function getToken() {
  return SecureStore.getItemAsync('jwt');
}

export async function removeToken() {
  return SecureStore.deleteItemAsync('jwt');
} 