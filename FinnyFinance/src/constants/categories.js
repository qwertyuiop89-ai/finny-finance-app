import { COLORS } from './colors';

export const TRANSACTION_CATEGORIES = {
  INCOME: {
    salary: {
      id: 'salary',
      name: 'Salário',
      icon: 'wallet',
      color: COLORS.success,
      type: 'income'
    },
    freelance: {
      id: 'freelance',
      name: 'Freelance',
      icon: 'laptop',
      color: COLORS.success,
      type: 'income'
    },
    investment: {
      id: 'investment',
      name: 'Investimentos',
      icon: 'trending-up',
      color: COLORS.success,
      type: 'income'
    },
    other_income: {
      id: 'other_income',
      name: 'Outros',
      icon: 'plus-circle',
      color: COLORS.success,
      type: 'income'
    }
  },
  EXPENSE: {
    food: {
      id: 'food',
      name: 'Alimentação',
      icon: 'restaurant',
      color: '#FF6B6B',
      type: 'expense'
    },
    transport: {
      id: 'transport',
      name: 'Transporte',
      icon: 'car',
      color: '#4ECDC4',
      type: 'expense'
    },
    entertainment: {
      id: 'entertainment',
      name: 'Lazer',
      icon: 'game-controller',
      color: '#45B7D1',
      type: 'expense'
    },
    bills: {
      id: 'bills',
      name: 'Contas',
      icon: 'receipt',
      color: '#96CEB4',
      type: 'expense'
    },
    shopping: {
      id: 'shopping',
      name: 'Compras',
      icon: 'bag',
      color: '#FFEAA7',
      type: 'expense'
    },
    health: {
      id: 'health',
      name: 'Saúde',
      icon: 'medical',
      color: '#DDA0DD',
      type: 'expense'
    },
    education: {
      id: 'education',
      name: 'Educação',
      icon: 'school',
      color: '#98D8C8',
      type: 'expense'
    },
    other_expense: {
      id: 'other_expense',
      name: 'Outros',
      icon: 'ellipsis-horizontal',
      color: COLORS.darkGray,
      type: 'expense'
    }
  }
};

export const getAllCategories = () => {
  return {
    ...TRANSACTION_CATEGORIES.INCOME,
    ...TRANSACTION_CATEGORIES.EXPENSE
  };
};

export const getCategoryById = (id) => {
  const allCategories = getAllCategories();
  return allCategories[id];
};