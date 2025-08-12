import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useTransactions } from '../hooks/useTransactions';
import { TRANSACTION_CATEGORIES, getAllCategories } from '../constants/categories';
import { COLORS } from '../constants/colors';

const AddTransactionScreen = ({ navigation }) => {
  const { addTransaction } = useTransactions();
  const [transactionType, setTransactionType] = useState('expense'); // income ou expense
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (!selectedCategory) {
      newErrors.category = 'Categoria é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const transactionData = {
        type: transactionType,
        amount: parseFloat(amount),
        description: description.trim(),
        category: selectedCategory,
        date: date,
      };
      
      const result = await addTransaction(transactionData);
      
      if (result.success) {
        Alert.alert(
          'Sucesso!',
          'Transação adicionada com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Erro', result.error || 'Erro ao adicionar transação');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao adicionar transação');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentCategories = () => {
    return transactionType === 'income' 
      ? TRANSACTION_CATEGORIES.INCOME 
      : TRANSACTION_CATEGORIES.EXPENSE;
  };

  const formatAmount = (value) => {
    // Remove tudo que não é número ou vírgula/ponto
    const cleanValue = value.replace(/[^\d.,]/g, '');
    return cleanValue;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Transação</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seletor de Tipo */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              transactionType === 'income' && styles.typeButtonActive,
              { backgroundColor: transactionType === 'income' ? COLORS.success : COLORS.lightGray }
            ]}
            onPress={() => {
              setTransactionType('income');
              setSelectedCategory(null);
            }}
          >
            <Ionicons 
              name="arrow-up" 
              size={24} 
              color={transactionType === 'income' ? COLORS.white : COLORS.darkGray} 
            />
            <Text style={[
              styles.typeButtonText,
              { color: transactionType === 'income' ? COLORS.white : COLORS.darkGray }
            ]}>
              Entrada
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              transactionType === 'expense' && styles.typeButtonActive,
              { backgroundColor: transactionType === 'expense' ? COLORS.danger : COLORS.lightGray }
            ]}
            onPress={() => {
              setTransactionType('expense');
              setSelectedCategory(null);
            }}
          >
            <Ionicons 
              name="arrow-down" 
              size={24} 
              color={transactionType === 'expense' ? COLORS.white : COLORS.darkGray} 
            />
            <Text style={[
              styles.typeButtonText,
              { color: transactionType === 'expense' ? COLORS.white : COLORS.darkGray }
            ]}>
              Saída
            </Text>
          </TouchableOpacity>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <CustomInput
            label="Valor"
            placeholder="0,00"
            value={amount}
            onChangeText={(value) => setAmount(formatAmount(value))}
            keyboardType="numeric"
            leftIcon="cash"
            error={errors.amount}
          />

          <CustomInput
            label="Descrição"
            placeholder="Digite uma descrição"
            value={description}
            onChangeText={setDescription}
            leftIcon="document-text"
            error={errors.description}
          />

          <CustomInput
            label="Data"
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
            leftIcon="calendar"
          />
        </View>

        {/* Seletor de Categoria */}
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Categoria</Text>
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}
          
          <View style={styles.categoryGrid}>
            {Object.values(getCurrentCategories()).map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id && styles.categoryItemActive,
                  { borderColor: selectedCategory === category.id ? category.color : COLORS.border }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View style={[
                  styles.categoryIcon,
                  { backgroundColor: category.color + '20' }
                ]}>
                  <Ionicons 
                    name={category.icon} 
                    size={24} 
                    color={category.color} 
                  />
                </View>
                <Text style={[
                  styles.categoryText,
                  { color: selectedCategory === category.id ? category.color : COLORS.darkGray }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botão de Salvar */}
        <CustomButton
          title="Salvar Transação"
          onPress={handleSubmit}
          loading={loading}
          style={styles.saveButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    padding: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  form: {
    marginBottom: 24,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryItemActive: {
    borderWidth: 2,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  saveButton: {
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.danger,
    marginBottom: 8,
  },
});

export default AddTransactionScreen;