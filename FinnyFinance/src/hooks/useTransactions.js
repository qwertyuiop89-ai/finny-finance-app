import { useState, useEffect } from 'react';
import { 
  getCurrentMonthTransactions, 
  getFinancialSummary,
  addTransaction as addTransactionService
} from '../services/transactionService';
import { useAuth } from './useAuth';

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categoryTotals: {},
    transactionCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTransactions = async () => {
    if (!user) return;
    
    try {
      const result = await getCurrentMonthTransactions(user.uid);
      if (result.success) {
        setTransactions(result.transactions);
        const financialSummary = getFinancialSummary(result.transactions);
        setSummary(financialSummary);
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const addTransaction = async (transactionData) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };
    
    try {
      const result = await addTransactionService(user.uid, transactionData);
      if (result.success) {
        await loadTransactions(); // Recarregar transações
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const refreshTransactions = async () => {
    setRefreshing(true);
    await loadTransactions();
  };

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  return {
    transactions,
    summary,
    loading,
    refreshing,
    addTransaction,
    refreshTransactions,
    loadTransactions
  };
};