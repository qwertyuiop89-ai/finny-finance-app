import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { useTransactions } from '../hooks/useTransactions';
import { getCategoryById, getAllCategories } from '../constants/categories';
import { COLORS } from '../constants/colors';

const HistoryScreen = ({ navigation }) => {
  const { transactions, refreshing, refreshTransactions } = useTransactions();
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // all, income, expense
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // all, week, month, year

  useEffect(() => {
    applyFilters();
  }, [transactions, selectedCategory, selectedType, selectedPeriod]);

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Filtrar por tipo
    if (selectedType !== 'all') {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    // Filtrar por período
    if (selectedPeriod !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (selectedPeriod) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(t => new Date(t.date) >= filterDate);
    }

    // Ordenar por data (mais recente primeiro)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredTransactions(filtered);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedPeriod('all');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedType !== 'all') count++;
    if (selectedPeriod !== 'all') count++;
    return count;
  };

  const renderTransactionItem = ({ item }) => {
    const category = getCategoryById(item.category);
    const isIncome = item.type === 'income';

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <View style={[
            styles.categoryIcon,
            { backgroundColor: category?.color + '20' || COLORS.lightGray }
          ]}>
            <Ionicons 
              name={category?.icon || 'help'} 
              size={20} 
              color={category?.color || COLORS.darkGray} 
            />
          </View>
          
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text style={styles.transactionCategory}>
              {category?.name || 'Categoria'} • {formatDate(item.date)}
            </Text>
            {item.note && (
              <Text style={styles.transactionNote}>{item.note}</Text>
            )}
          </View>
        </View>

        <View style={styles.transactionRight}>
          <Text style={[
            styles.transactionAmount,
            { color: isIncome ? COLORS.success : COLORS.danger }
          ]}>
            {isIncome ? '+' : '-'}{formatCurrency(Math.abs(item.amount))}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="receipt-outline" size={64} color={COLORS.darkGray} />
      <Text style={styles.emptyTitle}>Nenhuma transação encontrada</Text>
      <Text style={styles.emptySubtitle}>
        {getActiveFiltersCount() > 0 
          ? 'Tente ajustar os filtros para ver mais resultados'
          : 'Comece adicionando sua primeira transação'
        }
      </Text>
      {getActiveFiltersCount() > 0 && (
        <CustomButton
          title="Limpar Filtros"
          onPress={clearFilters}
          variant="outline"
          size="small"
          style={styles.clearFiltersButton}
        />
      )}
    </View>
  );

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
        <Text style={styles.headerTitle}>Histórico</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter" size={24} color={COLORS.primary} />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Lista de Transações */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshTransactions}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />

      {/* Modal de Filtros */}
      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color={COLORS.darkGray} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Filtro por Tipo */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Tipo</Text>
                <View style={styles.filterOptions}>
                  {[
                    { id: 'all', name: 'Todos' },
                    { id: 'income', name: 'Entradas' },
                    { id: 'expense', name: 'Saídas' },
                  ].map(type => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.filterOption,
                        selectedType === type.id && styles.filterOptionActive
                      ]}
                      onPress={() => setSelectedType(type.id)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedType === type.id && styles.filterOptionTextActive
                      ]}>
                        {type.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Filtro por Período */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Período</Text>
                <View style={styles.filterOptions}>
                  {[
                    { id: 'all', name: 'Todos' },
                    { id: 'week', name: 'Última semana' },
                    { id: 'month', name: 'Último mês' },
                    { id: 'year', name: 'Último ano' },
                  ].map(period => (
                    <TouchableOpacity
                      key={period.id}
                      style={[
                        styles.filterOption,
                        selectedPeriod === period.id && styles.filterOptionActive
                      ]}
                      onPress={() => setSelectedPeriod(period.id)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedPeriod === period.id && styles.filterOptionTextActive
                      ]}>
                        {period.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Filtro por Categoria */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Categoria</Text>
                <View style={styles.categoryGrid}>
                  <TouchableOpacity
                    style={[
                      styles.categoryFilterItem,
                      selectedCategory === 'all' && styles.categoryFilterItemActive
                    ]}
                    onPress={() => setSelectedCategory('all')}
                  >
                    <View style={styles.categoryFilterIcon}>
                      <Ionicons name="apps" size={20} color={COLORS.darkGray} />
                    </View>
                    <Text style={styles.categoryFilterText}>Todas</Text>
                  </TouchableOpacity>

                  {Object.values(getAllCategories()).map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryFilterItem,
                        selectedCategory === category.id && styles.categoryFilterItemActive
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <View style={[
                        styles.categoryFilterIcon,
                        { backgroundColor: category.color + '20' }
                      ]}>
                        <Ionicons 
                          name={category.icon} 
                          size={20} 
                          color={category.color} 
                        />
                      </View>
                      <Text style={styles.categoryFilterText}>{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <CustomButton
                title="Limpar"
                onPress={clearFilters}
                variant="outline"
                style={styles.modalButton}
              />
              <CustomButton
                title="Aplicar"
                onPress={() => setShowFilters(false)}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  filterButton: {
    padding: 8,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  transactionsList: {
    flex: 1,
  },
  transactionsContent: {
    padding: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
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
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
    color: COLORS.darkGray,
    opacity: 0.7,
  },
  transactionNote: {
    fontSize: 12,
    color: COLORS.darkGray,
    opacity: 0.6,
    fontStyle: 'italic',
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  clearFiltersButton: {
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  filterOptionTextActive: {
    color: COLORS.white,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryFilterItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 80,
  },
  categoryFilterItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  categoryFilterIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  categoryFilterText: {
    fontSize: 12,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

export default HistoryScreen;