# 🔥 Configuração do Firebase - Finny Finance

## Passo 1: Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Nome do projeto: `finny-finance`
4. Desabilite Google Analytics (opcional)
5. Clique em "Criar projeto"

## Passo 2: Configurar Authentication

1. No menu lateral, clique em "Authentication"
2. Clique em "Vamos começar"
3. Vá para a aba "Sign-in method"
4. Clique em "E-mail/senha"
5. Ative "E-mail/senha"
6. Clique em "Salvar"

## Passo 3: Configurar Firestore Database

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Selecione "Começar no modo de teste"
4. Escolha a localização (ex: southamerica-east1)
5. Clique em "Concluído"

## Passo 4: Obter Credenciais

1. No menu lateral, clique no ícone de engrenagem ⚙️
2. Clique em "Configurações do projeto"
3. Vá para a aba "Geral"
4. Role para baixo até "Seus apps"
5. Clique no ícone da web `</>`
6. Nome do app: `Finny Finance`
7. Clique em "Registrar app"
8. **COPIE** as credenciais mostradas

## Passo 5: Configurar no App

Edite o arquivo `src/services/firebase.js` e substitua:

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-project-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "seu-app-id"
};
```

## Passo 6: Configurar Regras do Firestore

1. Vá para "Firestore Database"
2. Clique na aba "Regras"
3. Substitua o conteúdo por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

4. Clique em "Publicar"

## 🎉 Pronto!

Agora você pode executar o app:

```bash
npm start
# ou
npx expo start
```

### Testando

1. Crie uma conta no app
2. Adicione algumas transações
3. Veja os relatórios
4. Interaja com o Finny!

### Problemas Comuns

- **Erro de Auth**: Verifique se o email/senha está ativado
- **Erro de Firestore**: Verifique se as regras estão corretas
- **App não conecta**: Verifique se as credenciais estão corretas

### Suporte

Se tiver problemas, verifique:
1. Console do Firebase para erros
2. Console do navegador/app para logs
3. Documentação do Firebase