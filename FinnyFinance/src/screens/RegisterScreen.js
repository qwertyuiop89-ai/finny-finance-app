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
import { createAccount } from '../services/authService';
import { COLORS } from '../constants/colors';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
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
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const result = await createAccount(email, password, name.trim());
      
      if (result.success) {
        Alert.alert(
          'Sucesso!',
          'Conta criada com sucesso! Bem-vindo ao Finny Finance!',
          [{ text: 'OK' }]
        );
        // A navegação será tratada automaticamente pelo AuthProvider
      } else {
        Alert.alert('Erro', result.error || 'Erro ao criar conta');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.goBack();
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
              size={120}
              mood="excited"
              message="Vamos começar sua jornada financeira juntos! 🎉"
              shouldAnimate={true}
            />
          </View>

          {/* Título */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>
              Junte-se ao Finny e organize suas finanças
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            <CustomInput
              label="Nome completo"
              placeholder="Digite seu nome"
              value={name}
              onChangeText={setName}
              leftIcon="person"
              error={errors.name}
              autoCapitalize="words"
            />

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

            <CustomInput
              label="Confirmar senha"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              leftIcon="lock-closed"
              error={errors.confirmPassword}
            />

            <CustomButton
              title="Criar conta"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />

            <CustomButton
              title="Já tenho uma conta"
              onPress={navigateToLogin}
              variant="outline"
              style={styles.loginButton}
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
    marginTop: 20,
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
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
    paddingBottom: 40,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  loginButton: {
    marginBottom: 20,
  },
});

export default RegisterScreen;