# 🦊 Finny Finance

Um aplicativo de finanças pessoais com gamificação e mascote interativo, desenvolvido em React Native com Expo.

## 📱 Sobre o App

O **Finny Finance** é um organizador financeiro que torna o controle de gastos divertido e intuitivo. Com o mascote Finny (uma raposa amigável), os usuários recebem feedback visual e mensagens motivacionais baseadas em seus hábitos de gastos.

### ✨ Principais Funcionalidades

- **🔐 Autenticação**: Login e cadastro com Firebase Auth
- **📊 Dashboard Intuitivo**: Visão geral do saldo e gastos mensais
- **💰 Gestão de Transações**: Adicionar entradas e saídas com categorias
- **📈 Relatórios Visuais**: Gráficos de pizza e linha para análise
- **🎯 Metas Mensais**: Definir e acompanhar orçamentos
- **🎮 Gamificação**: Sistema de conquistas e roupas para o Finny
- **🦊 Mascote Interativo**: Finny reage aos seus gastos com animações

## 🎨 Design

### Cores Principais
- **Verde Principal**: #2ECC71
- **Branco**: #FFFFFF  
- **Cinza Claro**: #F5F5F5
- **Amarelo Destaque**: #F1C40F

### Estilo
- Design minimalista e limpo
- Tipografia moderna (Inter/Poppins)
- Espaçamento generoso
- Ícones simples e intuitivos
- Animações suaves

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── components/          # Componentes reutilizáveis
│   ├── CustomButton.js
│   ├── CustomInput.js
│   └── FinnyMascot.js
├── constants/           # Constantes e configurações
│   ├── colors.js
│   ├── categories.js
│   └── finnyMessages.js
├── hooks/              # Hooks personalizados
│   ├── useAuth.js
│   └── useTransactions.js
├── navigation/         # Configuração de navegação
│   └── AppNavigator.js
├── screens/            # Telas do aplicativo
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── DashboardScreen.js
│   ├── AddTransactionScreen.js
│   ├── ReportsScreen.js
│   └── ProfileScreen.js
├── services/           # Serviços e APIs
│   ├── firebase.js
│   ├── authService.js
│   └── transactionService.js
└── utils/              # Utilitários
```

### Tecnologias Utilizadas

#### Core
- **React Native** com **Expo SDK 53**
- **React Navigation** para navegação
- **React Native Reanimated** para animações

#### Backend & Database
- **Firebase Auth** para autenticação
- **Firestore** para banco de dados
- **AsyncStorage** para persistência local

#### UI & Gráficos
- **React Native Chart Kit** para gráficos
- **React Native SVG** para ícones vetoriais
- **Expo Vector Icons** para ícones

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou yarn
- Expo CLI
- Conta no Firebase

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd FinnyFinance
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Firebase**
- Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
- Ative Authentication (Email/Password)
- Ative Firestore Database
- Copie as credenciais para `src/services/firebase.js`

4. **Execute o projeto**
```bash
npm start
# ou
npx expo start
```

5. **Abra no dispositivo**
- Use o app Expo Go no seu celular
- Ou execute em simulador iOS/Android

## 🎮 Sistema de Gamificação

### Humores do Finny
- **Feliz** (😊): Gastos dentro da meta
- **Animado** (😄): Economizando muito bem
- **Preocupado** (😰): Gastos próximos do limite
- **Triste** (😢): Gastos acima da meta

### Conquistas
- **Primeira Transação**: Adicionar primeira entrada/saída
- **Economizador Semanal**: 7 dias sem estourar orçamento
- **Meta Mensal**: Cumprir meta mensal
- **Mestre das Despesas**: 30 transações registradas

### Roupas do Finny
- **Padrão** 🦊: Disponível desde o início
- **Chapéu** 🎩: Desbloqueado ao economizar R$ 500
- **Óculos** 🤓: Desbloqueado com 50 transações
- **Gravata** 👔: Desbloqueado ao cumprir 3 metas mensais

## 📊 Funcionalidades Detalhadas

### Dashboard
- Saudação personalizada por horário
- Saldo total com cores dinâmicas
- Progresso da meta mensal
- Resumo de entradas e saídas
- Contador de transações

### Transações
- Tipos: Entrada e Saída
- Categorias predefinidas com ícones
- Validação de formulários
- Interface intuitiva de seleção

### Relatórios
- Gráfico de pizza por categorias
- Gráfico de linha dos últimos 7 dias
- Estatísticas detalhadas
- Mensagens motivacionais do Finny

### Perfil
- Edição de meta mensal
- Visualização de conquistas
- Roupas do mascote
- Configurações do app

## 🔧 Configuração do Firebase

### Authentication
```javascript
// Habilitar Email/Password no Firebase Console
// Authentication > Sign-in method > Email/Password
```

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions belong to authenticated users
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### Estrutura do Firestore

#### Coleção `users`
```javascript
{
  name: "João Silva",
  email: "joao@email.com",
  monthlyGoal: 2000,
  finnyOutfits: ["default", "hat"],
  achievements: ["first_transaction", "week_saver"],
  createdAt: "2024-01-01T00:00:00Z"
}
```

#### Coleção `transactions`
```javascript
{
  userId: "user_id_here",
  type: "expense", // ou "income"
  amount: 150.00,
  description: "Almoço no restaurante",
  category: "food",
  date: "2024-01-15",
  createdAt: "2024-01-15T12:30:00Z"
}
```

## 🎯 Roadmap Futuro

### Versão 2.0
- [ ] Modo escuro
- [ ] Notificações push
- [ ] Backup na nuvem
- [ ] Relatórios mensais/anuais
- [ ] Categorias personalizadas

### Versão 3.0
- [ ] Sincronização bancária
- [ ] Planejamento financeiro
- [ ] Metas de poupança
- [ ] Compartilhamento familiar
- [ ] Insights com IA

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvimento**: Desenvolvedor Sênior especializado em React Native
- **Design**: Interface minimalista focada em UX
- **Mascote**: Finny, a raposa mais amigável das finanças! 🦊

---

**Finny Finance** - Transformando o controle financeiro em uma experiência divertida e educativa! 🎉💰