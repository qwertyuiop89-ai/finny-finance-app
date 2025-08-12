import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PieChart, LineChart } from 'react-native-chart-kit';
import FinnyMascot from '../components/FinnyMascot';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../hooks/useAuth';
import { getCategoryById } from '../constants/categories';
import { getRandomMessage } from '../constants/finnyMessages';
import { COLORS } from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

const ReportsScreen = ({ navigation }) => {
  const { transactions, summary } = useTransactions();
  const { userData } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // month, week, year
  const [finnyMessage, setFinnyMessage] = useState('');
  const [monthlyComparison, setMonthlyComparison] = useState([]);

  useEffect(() => {
    // Definir mensagem motivacional do Finny
    if (summary.balance >= 0) {
      setFinnyMessage(getRandomMessage('MOTIVATIONAL'));
    } else {
      setFinnyMessage(getRandomMessage('TIPS'));
    }
    
    // Calcular comparativo mensal
    calculateMonthlyComparison();
  }, [summary, transactions]);

  const calculateMonthlyComparison = () => {
    const monthlyData = {};
    const currentDate = new Date();
    
    // Processar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      
      monthlyData[monthKey] = {
        name: monthName,
        income: 0,
        expense: 0,
        balance: 0,
      };
    }
    
    // Agrupar transações por mês
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (monthlyData[monthKey]) {
        if (transaction.type === 'income') {
          monthlyData[monthKey].income += transaction.amount;
        } else {
          monthlyData[monthKey].expense += transaction.amount;
        }
        monthlyData[monthKey].balance = monthlyData[monthKey].income - monthlyData[monthKey].expense;
      }
    });
    
    setMonthlyComparison(Object.values(monthlyData));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Preparar dados para gráfico de pizza (categorias)
  const preparePieChartData = () => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryTotals = {};
    
    expenseTransactions.forEach(transaction => {
      if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = 0;
      }
      categoryTotals[transaction.category] += transaction.amount;
    });

    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F0B27A'
    ];

    return Object.entries(categoryTotals)
      .map(([categoryId, amount], index) => {
        const category = getCategoryById(categoryId);
        return {
          name: category?.name || 'Outros',
          population: amount,
          color: category?.color || colors[index % colors.length],
          legendFontColor: COLORS.darkGray,
          legendFontSize: 12,
        };
      })
      .sort((a, b) => b.population - a.population)
      .slice(0, 6); // Mostrar apenas top 6 categorias
  };

  // Preparar dados para gráfico de linha (evolução)
  const prepareLineChartData = () => {
    if (selectedPeriod === 'month') {
      // Últimos 6 meses
      return {
        labels: monthlyComparison.map(m => m.name),
        datasets: [{
          data: monthlyComparison.map(m => m.balance),
          strokeWidth: 3,
          color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        }]
      };
    } else {
      // Últimos 7 dias (comportamento original)
      const last7Days = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
      }

      const dailyBalances = last7Days.map(date => {
        const dayTransactions = transactions.filter(t => 
          t.date.startsWith(date)
        );
        
        const dayIncome = dayTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const dayExpense = dayTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
          
        return dayIncome - dayExpense;
      });

      return {
        labels: last7Days.map(date => {
          const d = new Date(date);
          return `${d.getDate()}/${d.getMonth() + 1}`;
        }),
        datasets: [{
          data: dailyBalances,
          strokeWidth: 3,
          color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        }]
      };
    }
  };

  const pieData = preparePieChartData();
  const lineData = prepareLineChartData();

  const chartConfig = {
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
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
        <Text style={styles.headerTitle}>Relatórios</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mascote Finny */}
        <View style={styles.mascotContainer}>
          <FinnyMascot
            size={80}
            mood="happy"
            message={finnyMessage}
            shouldAnimate={true}
          />
        </View>

        {/* Resumo Geral */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Resumo Financeiro</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Saldo Atual</Text>
              <Text style={[
                styles.summaryValue,
                { color: summary.balance >= 0 ? COLORS.success : COLORS.danger }
              ]}>
                {formatCurrency(summary.balance)}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Meta Mensal</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(userData?.monthlyGoal || 0)}
              </Text>
            </View>
          </View>

          {userData?.monthlyGoal && (
            <View style={styles.goalProgress}>
              <Text style={styles.goalProgressText}>
                Progresso da Meta: {((summary.totalExpense / userData.monthlyGoal) * 100).toFixed(0)}%
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${Math.min((summary.totalExpense / userData.monthlyGoal) * 100, 100)}%`,
                      backgroundColor: (summary.totalExpense / userData.monthlyGoal) > 1 
                        ? COLORS.danger 
                        : COLORS.primary
                    }
                  ]} 
                />
              </View>
            </View>
          )}
        </View>

        {/* Gráfico de Pizza - Gastos por Categoria */}
        {pieData.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>Gastos por Categoria</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieData}
                width={screenWidth - 80}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 0]}
                absolute
              />
            </View>
          </View>
        )}

        {/* Seletor de Período */}
        <View style={styles.periodSelector}>
          <Text style={styles.cardTitle}>Período de Análise</Text>
          <View style={styles.periodButtons}>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'week' && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod('week')}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === 'week' && styles.periodButtonTextActive
              ]}>
                7 Dias
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'month' && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod('month')}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === 'month' && styles.periodButtonTextActive
              ]}>
                6 Meses
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Gráfico de Linha - Evolução */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>
            {selectedPeriod === 'month' ? 'Comparativo Mensal' : 'Evolução dos Últimos 7 Dias'}
          </Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={lineData}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              formatYLabel={(value) => `R$ ${parseFloat(value).toFixed(0)}`}
            />
          </View>
        </View>

        {/* Comparativo Mensal Detalhado */}
        {selectedPeriod === 'month' && monthlyComparison.length > 0 && (
          <View style={styles.comparisonCard}>
            <Text style={styles.cardTitle}>Detalhamento Mensal</Text>
            {monthlyComparison.slice(-3).map((month, index) => (
              <View key={index} style={styles.comparisonItem}>
                <View style={styles.comparisonHeader}>
                  <Text style={styles.comparisonMonth}>{month.name}</Text>
                  <Text style={[
                    styles.comparisonBalance,
                    { color: month.balance >= 0 ? COLORS.success : COLORS.danger }
                  ]}>
                    {formatCurrency(month.balance)}
                  </Text>
                </View>
                <View style={styles.comparisonDetails}>
                  <View style={styles.comparisonDetail}>
                    <Ionicons name="arrow-up" size={16} color={COLORS.success} />
                    <Text style={styles.comparisonDetailText}>
                      {formatCurrency(month.income)}
                    </Text>
                  </View>
                  <View style={styles.comparisonDetail}>
                    <Ionicons name="arrow-down" size={16} color={COLORS.danger} />
                    <Text style={styles.comparisonDetailText}>
                      {formatCurrency(month.expense)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Estatísticas Detalhadas */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Estatísticas</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={24} color={COLORS.success} />
              <Text style={styles.statLabel}>Total de Entradas</Text>
              <Text style={[styles.statValue, { color: COLORS.success }]}>
                {formatCurrency(summary.totalIncome)}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="trending-down" size={24} color={COLORS.danger} />
              <Text style={styles.statLabel}>Total de Saídas</Text>
              <Text style={[styles.statValue, { color: COLORS.danger }]}>
                {formatCurrency(summary.totalExpense)}
              </Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Ionicons name="receipt" size={24} color={COLORS.primary} />
              <Text style={styles.statLabel}>Transações</Text>
              <Text style={styles.statValue}>
                {summary.transactionCount}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="calendar" size={24} color={COLORS.accent} />
              <Text style={styles.statLabel}>Média Diária</Text>
              <Text style={styles.statValue}>
                {formatCurrency(summary.totalExpense / 30)}
              </Text>
            </View>
          </View>
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
  mascotContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
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
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
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
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
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
  cardTitle: {
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
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  goalProgress: {
    marginTop: 16,
  },
  goalProgressText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  periodSelector: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
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
  periodButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.darkGray,
  },
  periodButtonTextActive: {
    color: COLORS.white,
  },
  comparisonCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
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
  comparisonItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  comparisonMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  comparisonBalance: {
    fontSize: 16,
    fontWeight: '600',
  },
  comparisonDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comparisonDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonDetailText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginLeft: 4,
  },
});

export default ReportsScreen;