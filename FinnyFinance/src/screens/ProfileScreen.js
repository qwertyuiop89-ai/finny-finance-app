import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import FinnyMascot from '../components/FinnyMascot';
import { useAuth } from '../hooks/useAuth';
import { logOut } from '../services/authService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { COLORS } from '../constants/colors';

const ProfileScreen = ({ navigation }) => {
  const { user, userData, setUserData } = useAuth();
  const [editingGoal, setEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [achievements] = useState([
    { id: 'first_transaction', name: 'Primeira Transação', icon: 'star', unlocked: true },
    { id: 'week_saver', name: 'Economizador Semanal', icon: 'trophy', unlocked: true },
    { id: 'month_goal', name: 'Meta Mensal', icon: 'medal', unlocked: false },
    { id: 'expense_master', name: 'Mestre das Despesas', icon: 'ribbon', unlocked: false },
  ]);

  const [finnyOutfits] = useState([
    { id: 'default', name: 'Padrão', icon: '🦊', unlocked: true },
    { id: 'hat', name: 'Chapéu', icon: '🎩', unlocked: true },
    { id: 'glasses', name: 'Óculos', icon: '🤓', unlocked: false },
    { id: 'tie', name: 'Gravata', icon: '👔', unlocked: false },
  ]);

  useEffect(() => {
    if (userData?.monthlyGoal) {
      setNewGoal(userData.monthlyGoal.toString());
    }
  }, [userData]);

  const handleUpdateGoal = async () => {
    if (!user || !newGoal) return;

    const goalValue = parseFloat(newGoal);
    if (isNaN(goalValue) || goalValue <= 0) {
      Alert.alert('Erro', 'Meta deve ser um valor válido maior que zero');
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        monthlyGoal: goalValue
      });

      setUserData({ ...userData, monthlyGoal: goalValue });
      setEditingGoal(false);
      Alert.alert('Sucesso', 'Meta mensal atualizada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar meta mensal');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            const result = await logOut();
            if (!result.success) {
              Alert.alert('Erro', 'Erro ao fazer logout');
            }
          }
        }
      ]
    );
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
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
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Perfil do Usuário */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle" size={80} color={COLORS.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userData?.name || 'Usuário'}</Text>
              <Text style={styles.userEmail}>{userData?.email || user?.email}</Text>
            </View>
          </View>
        </View>

        {/* Mascote Finny */}
        <View style={styles.mascotSection}>
          <Text style={styles.sectionTitle}>Seu Amigo Finny</Text>
          <View style={styles.mascotContainer}>
            <FinnyMascot
              size={100}
              mood="happy"
              message="Você está indo muito bem com suas finanças! 🎉"
              shouldAnimate={true}
            />
          </View>
        </View>

        {/* Configurações */}
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          {/* Meta Mensal */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="target" size={24} color={COLORS.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Meta Mensal</Text>
                <Text style={styles.settingValue}>
                  {formatCurrency(userData?.monthlyGoal || 0)}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setEditingGoal(true)}
            >
              <Ionicons name="pencil" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Configurações Avançadas */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="settings" size={24} color={COLORS.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Configurações</Text>
                <Text style={styles.settingValue}>Tema, idioma, backup</Text>
              </View>
            </View>
            <View style={styles.editButton}>
              <Ionicons name="chevron-forward" size={20} color={COLORS.darkGray} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Conquistas */}
        <View style={styles.achievementsCard}>
          <Text style={styles.sectionTitle}>Conquistas</Text>
          <View style={styles.achievementsList}>
            {achievements.map(achievement => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementItem,
                  !achievement.unlocked && styles.achievementLocked
                ]}
              >
                <View style={[
                  styles.achievementIcon,
                  { backgroundColor: achievement.unlocked ? COLORS.accent + '20' : COLORS.lightGray }
                ]}>
                  <Ionicons 
                    name={achievement.icon} 
                    size={24} 
                    color={achievement.unlocked ? COLORS.accent : COLORS.darkGray} 
                  />
                </View>
                <Text style={[
                  styles.achievementName,
                  { color: achievement.unlocked ? COLORS.darkGray : COLORS.darkGray + '80' }
                ]}>
                  {achievement.name}
                </Text>
                {achievement.unlocked && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Roupas do Finny */}
        <View style={styles.outfitsCard}>
          <Text style={styles.sectionTitle}>Roupas do Finny</Text>
          <View style={styles.outfitsList}>
            {finnyOutfits.map(outfit => (
              <TouchableOpacity 
                key={outfit.id}
                style={[
                  styles.outfitItem,
                  !outfit.unlocked && styles.outfitLocked
                ]}
                disabled={!outfit.unlocked}
              >
                <Text style={styles.outfitIcon}>{outfit.icon}</Text>
                <Text style={[
                  styles.outfitName,
                  { color: outfit.unlocked ? COLORS.darkGray : COLORS.darkGray + '80' }
                ]}>
                  {outfit.name}
                </Text>
                {!outfit.unlocked && (
                  <Ionicons name="lock-closed" size={16} color={COLORS.darkGray} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botão de Logout */}
        <CustomButton
          title="Sair"
          onPress={handleLogout}
          variant="outline"
          style={[styles.logoutButton, { borderColor: COLORS.danger }]}
          textStyle={{ color: COLORS.danger }}
        />
      </ScrollView>

      {/* Modal para Editar Meta */}
      <Modal
        visible={editingGoal}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingGoal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Meta Mensal</Text>
            
            <CustomInput
              label="Nova meta (R$)"
              placeholder="0,00"
              value={newGoal}
              onChangeText={setNewGoal}
              keyboardType="numeric"
              leftIcon="target"
            />

            <View style={styles.modalButtons}>
              <CustomButton
                title="Cancelar"
                onPress={() => setEditingGoal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <CustomButton
                title="Salvar"
                onPress={handleUpdateGoal}
                loading={loading}
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  profileCard: {
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  mascotSection: {
    marginBottom: 20,
  },
  mascotContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
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
  settingsCard: {
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  editButton: {
    padding: 8,
  },
  achievementsCard: {
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
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  outfitsCard: {
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
  outfitsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  outfitItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginBottom: 12,
  },
  outfitLocked: {
    opacity: 0.6,
  },
  outfitIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  outfitName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  logoutButton: {
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default ProfileScreen;