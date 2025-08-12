import 'react-native-reanimated';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/hooks/useAuth';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/colors';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="dark" backgroundColor={COLORS.background} />
      <AppNavigator />
    </AuthProvider>
  );
}
