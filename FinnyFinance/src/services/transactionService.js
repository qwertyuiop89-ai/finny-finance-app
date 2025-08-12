import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  deleteDoc, 
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Adicionar nova transação
 */
export const addTransaction = async (userId, transactionData) => {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), {
      userId,
      ...transactionData,
      createdAt: new Date().toISOString(),
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Obter transações do usuário
 */
export const getUserTransactions = async (userId, startDate = null, endDate = null) => {
  try {
    let q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const transactions = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const transactionDate = new Date(data.date);
      
      // Filtrar por data se fornecido
      if (startDate && endDate) {
        if (transactionDate >= startDate && transactionDate <= endDate) {
          transactions.push({ id: doc.id, ...data });
        }
      } else {
        transactions.push({ id: doc.id, ...data });
      }
    });
    
    return { success: true, transactions };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Obter transações do mês atual
 */
export const getCurrentMonthTransactions = async (userId) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
  return await getUserTransactions(userId, startOfMonth, endOfMonth);
};

/**
 * Calcular resumo financeiro
 */
export const getFinancialSummary = (transactions) => {
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryTotals = {};
  
  transactions.forEach(transaction => {
    const amount = parseFloat(transaction.amount);
    
    if (transaction.type === 'income') {
      totalIncome += amount;
    } else {
      totalExpense += amount;
    }
    
    // Agrupar por categoria
    if (!categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] = 0;
    }
    categoryTotals[transaction.category] += amount;
  });
  
  const balance = totalIncome - totalExpense;
  
  return {
    totalIncome,
    totalExpense,
    balance,
    categoryTotals,
    transactionCount: transactions.length
  };
};

/**
 * Deletar transação
 */
export const deleteTransaction = async (transactionId) => {
  try {
    await deleteDoc(doc(db, 'transactions', transactionId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Atualizar transação
 */
export const updateTransaction = async (transactionId, updateData) => {
  try {
    await updateDoc(doc(db, 'transactions', transactionId), {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};