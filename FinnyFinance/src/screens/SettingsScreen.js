import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import { logOut } from '../services/authService';
import { COLORS } from '../constants/colors';

const SettingsScreen = ({ navigation }) => {
  const { user, userData } = useAuth();
  const { transactions } = useTransactions();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('pt-BR');

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

  const handleExportData = async () => {
    try {
      // Preparar dados para exportação
      const exportData = {
        user: {
          name: userData?.name,
          email: userData?.email,
          monthlyGoal: userData?.monthlyGoal,
        },
        transactions: transactions.map(t => ({
          date: t.date,
          type: t.type,
          amount: t.amount,
          description: t.description,
          category: t.category,
          note: t.note || '',
        })),
        exportDate: new Date().toISOString(),
        totalTransactions: transactions.length,
      };

      const jsonData = JSON.stringify(exportData, null, 2);
      
      // Compartilhar dados
      await Share.share({
        message: `Dados do Finny Finance exportados em ${new Date().toLocaleDateString('pt-BR')}`,
        title: 'Exportar Dados - Finny Finance',
        url: `data:application/json;charset=utf-8,${encodeURIComponent(jsonData)}`,
      });
    } catch (error) {
      Alert.alert('Erro', 'Erro ao exportar dados');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Esta ação não pode ser desfeita. Todos os seus dados serão perdidos permanentemente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Funcionalidade em Desenvolvimento',
              'A exclusão de conta estará disponível em breve. Por enquanto, você pode fazer logout e parar de usar o app.'
            );
          }
        }
      ]
    );
  };

  const showLanguageOptions = () => {
    Alert.alert(
      'Idioma',
      'Selecione o idioma do aplicativo',
      [
        { text: 'Português (Brasil)', onPress: () => setLanguage('pt-BR') },
        { text: 'English', onPress: () => setLanguage('en-US') },
        { text: 'Español', onPress: () => setLanguage('es-ES') },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const getLanguageName = () => {
    switch (language) {
      case 'pt-BR': return 'Português (Brasil)';
      case 'en-US': return 'English';
      case 'es-ES': return 'Español';
      default: return 'Português (Brasil)';
    }
  };

  const renderSettingItem = ({ icon, title, subtitle, onPress, rightComponent, showArrow = true }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: COLORS.primary + '20' }]}>
          <Ionicons name={icon} size={20} color={COLORS.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && !rightComponent && (
          <Ionicons name="chevron-forward" size={20} color={COLORS.darkGray} />
        )}
      </View>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção Aparência */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aparência</Text>
          
          {renderSettingItem({
            icon: darkMode ? 'moon' : 'sunny',
            title: 'Tema Escuro',
            subtitle: darkMode ? 'Ativado' : 'Desativado',
            rightComponent: (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                thumbColor={darkMode ? COLORS.white : COLORS.white}
              />
            ),
            showArrow: false,
          })}

          {renderSettingItem({
            icon: 'language',
            title: 'Idioma',
            subtitle: getLanguageName(),
            onPress: showLanguageOptions,
          })}
        </View>

        {/* Seção Notificações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          
          {renderSettingItem({
            icon: 'notifications',
            title: 'Notificações Push',
            subtitle: notifications ? 'Ativadas' : 'Desativadas',
            rightComponent: (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                thumbColor={notifications ? COLORS.white : COLORS.white}
              />
            ),
            showArrow: false,
          })}

          {renderSettingItem({
            icon: 'time',
            title: 'Lembretes Diários',
            subtitle: 'Configurar horários',
            onPress: () => Alert.alert('Em Breve', 'Funcionalidade em desenvolvimento'),
          })}
        </View>

        {/* Seção Dados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados</Text>
          
          {renderSettingItem({
            icon: 'download',
            title: 'Exportar Dados',
            subtitle: `${transactions.length} transações`,
            onPress: handleExportData,
          })}

          {renderSettingItem({
            icon: 'cloud-upload',
            title: 'Backup na Nuvem',
            subtitle: 'Sincronizar dados',
            onPress: () => Alert.alert('Em Breve', 'Funcionalidade em desenvolvimento'),
          })}

          {renderSettingItem({
            icon: 'refresh',
            title: 'Sincronizar',
            subtitle: 'Atualizar dados',
            onPress: () => Alert.alert('Sincronizado', 'Dados atualizados com sucesso!'),
          })}
        </View>

        {/* Seção Privacidade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacidade</Text>
          
          {renderSettingItem({
            icon: 'shield-checkmark',
            title: 'Política de Privacidade',
            subtitle: 'Como protegemos seus dados',
            onPress: () => Alert.alert('Política de Privacidade', 'Seus dados são protegidos e nunca compartilhados com terceiros.'),
          })}

          {renderSettingItem({
            icon: 'document-text',
            title: 'Termos de Uso',
            subtitle: 'Condições de utilização',
            onPress: () => Alert.alert('Termos de Uso', 'Use o app de forma responsável e para fins pessoais.'),
          })}
        </View>

        {/* Seção Suporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          
          {renderSettingItem({
            icon: 'help-circle',
            title: 'Central de Ajuda',
            subtitle: 'Perguntas frequentes',
            onPress: () => Alert.alert('Ajuda', 'Para suporte, entre em contato através do email: suporte@finnyfinance.com'),
          })}

          {renderSettingItem({
            icon: 'chatbubble',
            title: 'Feedback',
            subtitle: 'Envie sua opinião',
            onPress: () => Alert.alert('Feedback', 'Obrigado pelo interesse! Envie sugestões para: feedback@finnyfinance.com'),
          })}

          {renderSettingItem({
            icon: 'information-circle',
            title: 'Sobre o App',
            subtitle: 'Versão 1.0.0',
            onPress: () => Alert.alert('Finny Finance', 'Versão 1.0.0\nDesenvolvido com ❤️ para ajudar você a organizar suas finanças!'),
          })}
        </View>

        {/* Seção Conta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          
          {!userData?.isGuest && renderSettingItem({
            icon: 'person-remove',
            title: 'Excluir Conta',
            subtitle: 'Remover permanentemente',
            onPress: handleDeleteAccount,
          })}
        </View>

        {/* Botão de Logout */}
        <CustomButton
          title={userData?.isGuest ? "Sair do Modo Visitante" : "Sair da Conta"}
          onPress={handleLogout}
          variant="outline"
          style={[styles.logoutButton, { borderColor: COLORS.danger }]}
          textStyle={{ color: COLORS.danger }}
        />

        {/* Informações do Usuário */}
        {userData?.isGuest && (
          <View style={styles.guestInfo}>
            <Ionicons name="information-circle" size={20} color={COLORS.accent} />
            <Text style={styles.guestText}>
              Você está no modo visitante. Seus dados não são salvos permanentemente.
            </Text>
          </View>
        )}
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: COLORS.darkGray,
    opacity: 0.7,
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    marginVertical: 20,
  },
  guestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  guestText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default SettingsScreen;