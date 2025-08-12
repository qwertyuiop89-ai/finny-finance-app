import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FinnyMascot from '../components/FinnyMascot';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import { getGreetingByTime, getSpendingFeedback } from '../constants/finnyMessages';
import { COLORS } from '../constants/colors';

const DashboardScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const { summary, loading, refreshing, refreshTransactions } = useTransactions();
  const [finnyMessage, setFinnyMessage] = useState('');
  const [finnyMood, setFinnyMood] = useState('happy');

  useEffect(() => {
    // Atualizar mensagem e humor do Finny baseado nos gastos
    const spendingPercentage = userData?.monthlyGoal 
      ? (summary.totalExpense / userData.monthlyGoal) * 100 
      : 0;

    setFinnyMessage(getSpendingFeedback(spendingPercentage));
    
    if (spendingPercentage <= 50) {
      setFinnyMood('excited');
    } else if (spendingPercentage <= 80) {
      setFinnyMood('happy');
    } else if (spendingPercentage <= 100) {
      setFinnyMood('worried');
    } else {
      setFinnyMood('sad');
    }
  }, [summary, userData]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getSpendingPercentage = () => {
    if (!userData?.monthlyGoal || userData.monthlyGoal === 0) return 0;
    return (summary.totalExpense / userData.monthlyGoal) * 100;
  };

  const navigateToAddTransaction = () => {
    navigation.navigate('AddTransaction');
  };

  const navigateToReports = () => {
    navigation.navigate('Reports');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshTransactions}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header com Saudação */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>
              {getGreetingByTime()}
            </Text>
            <Text style={styles.nameText}>
              {userData?.name || 'Usuário'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle" size={32} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Mascote Finny */}
        <View style={styles.mascotContainer}>
          <FinnyMascot
            size={100}
            mood={finnyMood}
            message={finnyMessage}
            shouldAnimate={true}
          />
        </View>

        {/* Card de Saldo */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Total</Text>
          <Text style={[
            styles.balanceAmount,
            { color: summary.balance >= 0 ? COLORS.success : COLORS.danger }
          ]}>
            {formatCurrency(summary.balance)}
          </Text>
          
          {userData?.monthlyGoal && (
            <View style={styles.goalProgress}>
              <Text style={styles.goalText}>
                Meta mensal: {formatCurrency(userData.monthlyGoal)}
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${Math.min(getSpendingPercentage(), 100)}%`,
                      backgroundColor: getSpendingPercentage() > 100 
                        ? COLORS.danger 
                        : getSpendingPercentage() > 80 
                          ? COLORS.accent 
                          : COLORS.primary
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {getSpendingPercentage().toFixed(0)}% da meta utilizada
              </Text>
            </View>
          )}
        </View>

        {/* Resumo do Mês */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Resumo do Mês</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: COLORS.success + '20' }]}>
                <Ionicons name="arrow-up" size={24} color={COLORS.success} />
              </View>
              <Text style={styles.summaryLabel}>Entradas</Text>
              <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                {formatCurrency(summary.totalIncome)}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: COLORS.danger + '20' }]}>
                <Ionicons name="arrow-down" size={24} color={COLORS.danger} />
              </View>
              <Text style={styles.summaryLabel}>Saídas</Text>
              <Text style={[styles.summaryValue, { color: COLORS.danger }]}>
                {formatCurrency(summary.totalExpense)}
              </Text>
            </View>
          </View>

          <View style={styles.transactionCount}>
            <Ionicons name="receipt" size={20} color={COLORS.darkGray} />
            <Text style={styles.transactionCountText}>
              {summary.transactionCount} transações este mês
            </Text>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionButtons}>
          <CustomButton
            title="+ Adicionar Transação"
            onPress={navigateToAddTransaction}
            style={styles.addButton}
          />
          
          <CustomButton
            title="Ver Relatórios"
            onPress={navigateToReports}
            variant="outline"
            style={styles.reportsButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  profileButton: {
    padding: 8,
  },
  mascotContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  balanceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  goalProgress: {
    marginTop: 16,
  },
  goalText: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionCount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  transactionCountText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginLeft: 8,
  },
  actionButtons: {
    marginTop: 10,
  },
  addButton: {
    marginBottom: 12,
  },
  reportsButton: {
    marginBottom: 20,
  },
});

export default DashboardScreen;