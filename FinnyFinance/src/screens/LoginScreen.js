import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import FinnyMascot from '../components/FinnyMascot';
import { signIn, signInWithGoogle, signInAsGuest } from '../services/authService';
import { COLORS } from '../constants/colors';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        // A navegação será tratada automaticamente pelo AuthProvider
      } else {
        Alert.alert('Erro', result.error || 'Erro ao fazer login');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      const result = await signInWithGoogle();
      
      if (!result.success) {
        Alert.alert('Aviso', result.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao fazer login com Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    
    try {
      const result = await signInAsGuest();
      
      if (result.success) {
        Alert.alert(
          'Modo Visitante',
          'Você está usando o app como visitante. Seus dados não serão salvos permanentemente.',
          [{ text: 'Entendi' }]
        );
      } else {
        Alert.alert('Erro', result.error || 'Erro ao entrar como visitante');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao entrar como visitante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header com Mascote */}
          <View style={styles.header}>
            <FinnyMascot
              size={140}
              mood="happy"
              message="Olá! Bem-vindo ao Finny Finance! 🦊"
              shouldAnimate={true}
            />
          </View>

          {/* Título */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Finny Finance</Text>
            <Text style={styles.subtitle}>
              Organize suas finanças com seu amigo Finny
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            <CustomInput
              label="Email"
              placeholder="Digite seu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              leftIcon="mail"
              error={errors.email}
              autoCapitalize="none"
            />

            <CustomInput
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon="lock-closed"
              error={errors.password}
            />

            <CustomButton
              title="Entrar"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            <CustomButton
              title="Entrar com Google"
              onPress={handleGoogleLogin}
              variant="secondary"
              style={styles.googleButton}
              disabled={loading}
            />

            <CustomButton
              title="Criar nova conta"
              onPress={navigateToRegister}
              variant="outline"
              style={styles.registerButton}
            />

            <CustomButton
              title="Entrar como visitante"
              onPress={handleGuestLogin}
              variant="outline"
              style={[styles.guestButton, { borderColor: COLORS.darkGray }]}
              textStyle={{ color: COLORS.darkGray }}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  googleButton: {
    marginBottom: 12,
  },
  registerButton: {
    marginBottom: 12,
  },
  guestButton: {
    marginBottom: 20,
  },
});

export default LoginScreen;